import urllib.parse
from fastapi.exceptions import HTTPException

def validate_request_data(url, start=0, end=0):
    if not url:
        raise HTTPException(400, "URL is required")
    # if start < 0:
    #     raise HTTPException(400, "Start time must be greater than 0")
    # if end <= start:
    #     raise HTTPException(400, "End time must be greater than start time")
    
def get_video_id(url):
    try:
        parsed_url = urllib.parse.urlparse(url)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        return query_params.get("v", [""])[0]  # Extract the video ID safely
    except RuntimeError:
        raise HTTPException(400, "Invalid URL")