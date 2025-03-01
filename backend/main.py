import os
import shutil
import openai
import cv2
import base64
import re
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (change to ["http://localhost:5173"] for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Directory for storing uploaded videos
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class VideoRequest(BaseModel):
    file_name: str

def extract_key_frames(video_path, interval=2, frame_count=5):
    """Extracts key frames from a video every `interval` seconds, limiting to `frame_count`."""
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval = fps * interval

    frames = []
    frame_count = 0

    while cap.isOpened():
        success, frame = cap.read()
        if not success or frame_count >= 5:
            break
        if frame_count % frame_interval == 0:
            _, buffer = cv2.imencode(".jpg", frame)
            frame_base64 = base64.b64encode(buffer).decode("utf-8")
            frames.append(frame_base64)
        frame_count += 1

    cap.release()
    return frames

def analyze_frame_with_openai(image_base64):
    """Sends a frame to OpenAI's GPT-4o-mini API for disaster analysis."""
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content":
             "You are an AI that analyzes disaster footage. "
             "Return a string of 5 answers, every answer answering the following questions seperated by a comma: 1. the damage severity, 2. the critical response level, 3. the infrastructure affected, 4. the health hazards, 5. the civilian rescue needed."
             "The damage severity can be one of the following: severe, moderate, minor."
             "Critical response level should be between 1 and 5."
             "Try to keep the words in each index between 1-3 words"
             "The civilian rescue needed can be one of the following: affirmative, negative."   
             "DO NOT INCLUDE ANY EXTRA TEXT"
             "Do not include text for new lines"
             "Example output: ['Severe, 4, Homes, Contaminated water, Affirmative', 'Moderate, 3, Buildings , Smoke, Negative', 'Minor, 2, Roads, None, Negative', 'Severe, 4, Homes, Contaminated water, Affirmative', 'Severe, 4, Homes, Contaminated water, Affirmative']"    
            }
        ],
        max_tokens=500
    )

    return response.choices[0].message.content

def parse_disaster_response(frames):
    """Parses the raw OpenAI response into a structured JSON format."""
    structured_data = []

    for frame in frames:
        frame_entries = frame.strip().strip("[]").replace("'", "").split(", ")

        for i in range(0, len(frame_entries), 5):  # Process in chunks of 5 elements
            if i + 4 < len(frame_entries):
                structured_data.append({
                    "damage_severity": frame_entries[i],
                    "critical_response_level": int(frame_entries[i + 1]),
                    "infrastructure_affected": frame_entries[i + 2],
                    "health_hazards": frame_entries[i + 3],
                    "civilian_rescue_needed": frame_entries[i + 4]
                })

    return {"frames": structured_data}


@app.post("/upload-video/")
async def upload_video(file: UploadFile = File(...)):
    """Handles video upload and saves it to the server."""
    video_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if not os.path.exists(video_path):
            return {"error": "File upload failed"}

        return {"message": "Video uploaded successfully!", "file_name": file.filename}

    except Exception as e:
        return {"error": f"Upload failed: {str(e)}"}


@app.post("/process-video/")
async def process_video(request: VideoRequest):
    """Processes the uploaded video and generates a structured JSON response."""
    video_path = os.path.join(UPLOAD_DIR, request.file_name)

    if not os.path.exists(video_path):
        return {"error": f"Video '{request.file_name}' not found"}

    frames = extract_key_frames(video_path)

    if not frames:
        return {"error": "No frames extracted"}

    try:
        raw_responses = [analyze_frame_with_openai(frame) for frame in frames[:5]]
        structured_data = parse_disaster_response(raw_responses)
    except Exception as e:
        return {"error": f"OpenAI API failed: {str(e)}"}

    return {
        "message": "Video processed successfully!",
        "frames": structured_data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
