import cv2.cv2 as cv2
import asyncio
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from livestock_tracking import LivestockTracker
from drone_control import DroneControl


app = FastAPI()
drone_control = DroneControl()
livestock_tracker = LivestockTracker()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:63342"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return JSONResponse({"message": "Swarming Drones Control Center"})


@app.post("/drones/setup")
def setup_drones(ip_addresses: list[str]):
    drone_control.setup_drones(ip_addresses)
    return JSONResponse({"message": "Drones set up successfully"})


@app.get("/drones/control")
def get_number_of_drones():
    drones_in_swarm = len(drone_control.drones)
    return JSONResponse({"number_of_drones": drones_in_swarm})


# Endpoint to retrieve video feed of the drone
@app.get("/drone/video_feed")
async def video_feed():
    video_path = "./cow_00001_preview.mp4"
    video = cv2.VideoCapture(video_path)

    fps = video.get(cv2.CAP_PROP_FPS)
    frame_width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    content_type = "multipart/x-mixed-replace; boundary=frame"

    async def stream_generator():
        while True:
            ret, frame = video.read()
            if not ret:
                video.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            cows = None  # Insert a function to return the position of cows on the screen.
            # cows = cow_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            for (x, y, w, h) in cows:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            _, jpeg_frame = cv2.imencode(".jpg", frame)
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + jpeg_frame.tobytes() + b"\r\n"
            )

            # A small delay to match the video's frame rate
            await asyncio.sleep(1 / fps)

    return StreamingResponse(stream_generator(), media_type=content_type)


# Endpoint to control drones
@app.post("/drones/control")
def control_drone(payload: list):
    response = drone_control.send_command(payload[0], payload[1])
    return JSONResponse({"response": response})
