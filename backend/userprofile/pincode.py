import requests

def fetch_pincode_info(pincode: str) -> dict:
    url = f"https://api.postalpincode.in/pincode/{pincode}"
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
    }
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    return res.json()
