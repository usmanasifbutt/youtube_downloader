# Use the official Python image
FROM python:3.12-slim AS backend

# Set working directory
WORKDIR /app

# Copy requirements and install them
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Ensure temp-downloads directory exists
RUN mkdir -p ./temp-downloads

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose FastAPI default port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
