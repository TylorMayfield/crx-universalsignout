from playwright.sync_api import sync_playwright, expect
import time

def main():
    with sync_playwright() as p:
        path_to_extension = "./dist"
        user_data_dir = "/tmp/test-user-data-dir"

        context = p.chromium.launch_persistent_context(
            user_data_dir,
            headless=True,
            args=[
                f"--disable-extensions-except={path_to_extension}",
                f"--load-extension={path_to_extension}",
            ],
        )

        # Poll for the service worker to appear
        service_worker = None
        for _ in range(10): # Poll for 10 seconds
            if context.service_workers:
                service_worker = context.service_workers[0]
                break
            time.sleep(1)

        if not service_worker:
            print("Could not find service worker after polling. Exiting.")
            context.close()
            return

        extension_id = service_worker.url.split('/')[2]

        # Navigate to the extension's popup page
        page = context.new_page()
        page.goto(f"chrome-extension://{extension_id}/index.html")

        # Verify that the header is visible
        header = page.locator('text="Universal Sign Out"')
        expect(header).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        context.close()

if __name__ == "__main__":
    main()
