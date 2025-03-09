
# 📥 **YouTube Video Downloader**

This project is a **YouTube video downloader** that allows users to:

-   Enter a YouTube URL.
-   Select video quality and format.
-   Download videos directly to their device.

### 🔧 **Technologies Used**

-   **Frontend:** Next.js, Tailwind CSS
-   **Backend:** FastAPI, Python

This setup ensures a smooth and user-friendly experience for downloading YouTube videos.

----------

## 📌 **Requirements**

-   **Python 3.12+** (for backend)
-   **Node.js 18+** and **npm** (for frontend)

----------

## 🖥 **Backend Setup (FastAPI)**

### 1️⃣ **Create Virtual Environment**

Run the following commands in the backend directory:

```
cd backend
python3 -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate on Linux/Mac
```

----------

### 2️⃣ **Install Dependencies**

With the virtual environment activated, install the requirements:

```
pip install -r requirements.txt
``` 

----------

### 3️⃣ **Configure Environment Variables**

-   Copy `.env.example` to `.env`:

```
cp .env.example .env
``` 

-   Open `.env` and set your environment variables:

```
# Example .env file
YOUTUBE_API_KEY=your-api-key
DOWNLOAD_PATH=./downloads
``` 

----------

### 4️⃣ **Run Backend Server**

Start the FastAPI server:

bash

CopyEdit

```
uvicorn main:app --reload
``` 

**API will be available at:** [http://localhost:8000](http://localhost:8000)

----------

## 🖥 **Frontend Setup (Next.js)**

### 1️⃣ **Install Dependencies**

Go to the frontend directory and install the dependencies:

```
cd frontend
npm install
``` 

----------

### 2️⃣ **Configure Environment Variables**

-   Copy `.env.example` to `.env.local`:

```
cp .env.example .env.local
``` 

-   Open `.env.local` and set your environment variables:

```
# Example .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
``` 

----------

### 3️⃣ **Run Frontend Server**

Start the Next.js development server:

```
npm run dev
``` 

**Frontend will be available at:** [http://localhost:3000](http://localhost:3000)

----------

## 🛠 **Common Issues**

-   **CORS Errors:** Make sure CORS is configured correctly in FastAPI.
-   **Dependencies Issues:** Run `pip install --upgrade pip` and try again.

----------

## 🤝 **Contributing**

-   Fork the repo
-   Create a new branch (`git checkout -b feature/YourFeature`)
-   Commit changes (`git commit -m 'Add new feature'`)
-   Push to branch (`git push origin feature/YourFeature`)
-   Create a Pull Request