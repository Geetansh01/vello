import asyncio
import httpx

UPLOAD_URL = "https://image.wellmed.workers.dev/api/upload"  # your Worker endpoint

async def upload_image(file_path: str):
    timeout = httpx.Timeout(60.0)  # 60 seconds
    async with httpx.AsyncClient(timeout=timeout) as client:
        with open(file_path, "rb") as f:
            # Must use key 'photo' to match your Worker
            files = {"photo": (file_path.split("/")[-1], f, "image/png")}
            response = await client.post(UPLOAD_URL, files=files)
            return response.json()

async def main():
    result = await upload_image(r"D:\Repos\vello\assets\gradient.webp")
    print("Upload response:", result)

if __name__ == "__main__":
    asyncio.run(main())
