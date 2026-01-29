from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000/index.html")

        # Start Symbols mode
        page.click(".skill-symbols")
        time.sleep(1)

        # Check lives are shown and = 3
        lives_text = page.locator("#lives").inner_text()
        print(f"Initial Lives: {lives_text}")
        assert lives_text == "3"

        # Wait for asteroid to fall and hit bottom.
        # We need to make sure an asteroid actually spawns.
        # Spawns every 2s.
        print("Waiting for asteroids to fall...")
        time.sleep(15)

        lives_text_after = page.locator("#lives").inner_text()
        print(f"Lives after waiting: {lives_text_after}")

        # Should be less than 3
        assert int(lives_text_after) < 3

        browser.close()

if __name__ == "__main__":
    run()
