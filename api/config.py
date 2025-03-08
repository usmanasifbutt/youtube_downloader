from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    AWS_ACCESS_KEY: str = ""
    AWS_SECRET_KEY: str = ""
    AWS_REGION: str = ""
    S3_BUCKET_NAME: str = ""
    
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    ALLOWED_METHODS: str = "*"
    ALLOWED_HEADERS: str = "*"
    ALLOWED_CREDENTIALS: bool = True
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()