import boto3
from config import settings

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION,
)

def upload_to_s3(file_path, s3_key):
    """Uploads file to S3 and returns a presigned URL."""
    try:
        s3_client.upload_file(file_path, settings.S3_BUCKET_NAME, s3_key)

        # Generate a presigned URL
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET_NAME, "Key": s3_key},
            ExpiresIn=3600,  # URL expires in 1 hour
        )
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return None

