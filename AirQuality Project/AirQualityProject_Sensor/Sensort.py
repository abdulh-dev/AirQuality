# pi_ws_client.py
import asyncio
import websockets
import csv
import time

WS_SERVER = "ws://<backend_IP_address>:8000/ws/ingest" ## BAckend is hosted on Render 

async def send_csv_data():
    async with websockets.connect(WS_SERVER) as websocket:
        print("Connected to server")

        with open("sensor_data.csv", "r") as f:
            reader = csv.reader(f)
            next(reader)  # skip header

            for row in reader:
                line = ",".join(row)
                await websocket.send(line)
                response = await websocket.recv()
                print(f"Sent: {line} | Server: {response}")
                time.sleep(2)  # simulate sensor interval

asyncio.run(send_csv_data())
