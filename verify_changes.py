from playwright.sync_api import sync_playwright
import time
import os

def run():
    os.makedirs("/home/jules/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Adventure Mode Map Verification
        page.goto("http://localhost:8000/index.html")
        page.click(".skill-shift") # Click Shift card
        time.sleep(1) # Wait for animation
        page.screenshot(path="/home/jules/verification/adventure_map.png")
        print("Adventure Map screenshot taken.")

        # 2. Space Mode Symbols Verification
        page.goto("http://localhost:8000/index.html")
        page.click(".skill-symbols")
        time.sleep(1)
        # Wait for an asteroid to spawn (2s delay in code)
        time.sleep(2.5)
        page.screenshot(path="/home/jules/verification/space_mode.png")
        print("Space Mode screenshot taken.")

        # 3. Race Mode Cars Verification
        page.goto("http://localhost:8000/index.html")
        page.click(".skill-speed")
        time.sleep(1)
        page.screenshot(path="/home/jules/verification/race_mode.png")
        print("Race Mode screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
