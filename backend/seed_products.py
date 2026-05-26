"""
Seed script: Fetches all products from Jan Aushadhi API and inserts them into the database.
Run: cd backend && python seed_products.py
"""
import os
import sys
import django
import requests
import time

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from products.models import Product

BASE_URL = "https://janaushadhi.gov.in:8443"
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": "https://janaushadhi.gov.in",
    "Referer": "https://janaushadhi.gov.in/productportfolio/ProductviewList",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}
PAGE_SIZE = 100


def get_token():
    resp = requests.get(f"{BASE_URL}/auth/generateGuestToken", headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["responseBody"]


def fetch_page(token, page_index):
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    payload = {
        "pageIndex": page_index,
        "pageSize": PAGE_SIZE,
        "searchText": "",
        "orderBy": "asc",
        "columnName": "drug_code",
    }
    resp = requests.post(f"{BASE_URL}/api/v1/admin/product/getAllProductForWeb", headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()["responseBody"]


from django.db import IntegrityError

def main():
    print("Getting token...")
    token = get_token()

    Product.objects.all().delete()
    print("Cleared existing products.")

    print("Fetching and inserting products...")
    page = 0
    total = 0

    while True:
        data = fetch_page(token, page)
        items = data["newProductResponsesList"]
        if not items:
            break

        for item in items:
            for attempt in range(5):
                try:
                    Product(
                        name=item["genericName"],
                        company="Jan Aushadhi",
                        disease_category=item.get("groupName", ""),
                        mrp=item["mrp"],
                        discount=0,
                        available_stock=100 if item.get("status") == 1 else 0,
                        description=f"{item['genericName']} - Unit Size: {item.get('unitSize', 'N/A')}",
                        prescription_required=False,
                    ).save()
                    break
                except IntegrityError:
                    continue

        total += len(items)
        print(f"  Page {page}: {len(items)} products (total: {total})")

        if data.get("isLastPage"):
            break
        page += 1
        time.sleep(0.3)

    print(f"\nDone! Inserted {total} products.")


if __name__ == "__main__":
    main()
