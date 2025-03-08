import redis
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from utils import validate_request_data, get_video_id
from config import settings
from processor import process_video

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=settings.ALLOWED_CREDENTIALS,
    allow_methods=[settings.ALLOWED_METHODS],
    allow_headers=[settings.ALLOWED_HEADERS],
)

# Redis client to store progress (you can use a database instead)
redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)

@app.get("/api/trim")
async def trim_video(url: str, start: str, end: str, background_tasks: BackgroundTasks):
    validate_request_data(url, start, end)
    video_id = get_video_id(url)
    
    task_id = str(video_id)
    redis_client.set(task_id, "0")
    
    background_tasks.add_task(process_video, url, start, end, task_id)
    return JSONResponse({"task_id": task_id})

@app.get("/api/progress/{task_id}")
def get_progress(task_id: str):
    progress = redis_client.get(task_id)

    if not progress:
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        # Try converting progress to an integer for checking
        progress_count = int(progress)
    except ValueError:
        # If it can't be converted, then it's likely a URL or something else
        progress_count = None
    
    if progress_count is not None:
        # If the value can be converted to an integer, it's still processing
        return JSONResponse({"progress": progress_count, "status": "processing"})
    
    # Once the processing is completed, the progress will be a download URL
    return JSONResponse({"download_url": progress, "status": "completed"})
