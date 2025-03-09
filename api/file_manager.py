import os
from config import settings

def clean_temp_downloads():
    """Deletes all files in the temp-downloads directory."""
    for filename in os.listdir(settings.CUSTOM_TEMP_DIR):
        file_path = os.path.join(settings.CUSTOM_TEMP_DIR, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")
