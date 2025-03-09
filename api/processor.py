import os
import redis
import ffmpeg
import tempfile
import shutil
from config import settings
from s3 import upload_to_s3
from yt_dlp import YoutubeDL

redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)

def get_download_url(url: str):
    ydl_opts = {
        "format": "best",
        "outtmpl": "downloads/%(title)s.%(ext)s",
    }
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
    return info["url"], info["title"]

def process_video(url: str, start: str, end: str, task_id: str, action: str = "trim"):

    def download_progress_hook(d):
        if d['status'] == 'downloading':
            # Calculate the download percentage and update progress in Redis
            if 'downloaded_bytes' in d and 'total_bytes' in d:
                progress = (d['downloaded_bytes'] / d['total_bytes']) * 100
                redis_client.set(task_id, str(int(progress)))

    def ffmpeg_progress_hook(stdout, stderr, task_id):
            for line in stdout:
                if 'out_time=' in line:
                    time_str = line.split('out_time=')[1].split()[0]
                    current_time = float(time_str)
                    duration = float(stderr.split('Duration: ')[1].split(',')[0].split(':')[2])
                    progress = (current_time / duration) * 50 + 50  # Add 50% for processing
                    redis_client.set(task_id, str(int(progress)))
                
    with tempfile.TemporaryDirectory() as tmp_dir:
        video_path = os.path.join(tmp_dir, "video.mp4")
        output_path = os.path.join(tmp_dir, "trimmed.mp4")

        ydl_opts = {
            "format": "best",
            "outtmpl": video_path,
            "progress_hooks": [download_progress_hook],
        }
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        if action != "download":
            ffmpeg_process = ffmpeg.input(video_path, ss=start, to=end).output(output_path).run_async(
                pipe_stdout=True, pipe_stderr=True)

            # Capturing the output to get progress information
            stdout, stderr = ffmpeg_process.communicate()
            
            ffmpeg_progress_hook(stdout.decode('utf-8').split('\n'), stderr.decode('utf-8'), task_id)
            
        redis_client.set(task_id, "99")  # Update progress to 100% when done
        
        if settings.ENABLE_S3:
            s3_key = f"trimmed_videos/{task_id}_trimmed.mp4"
            presigned_url = upload_to_s3(output_path, s3_key)
            redis_client.set(task_id, presigned_url)  # Store download URL
        else:
            temp_path = os.path.join(settings.CUSTOM_TEMP_DIR, f"{task_id}_trimmed.mp4")
            shutil.move(output_path, temp_path)
            redis_client.set(task_id, f"/temp-downloads/{task_id}_trimmed.mp4")
