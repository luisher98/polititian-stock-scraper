export async function goToPage(page, url) {
    console.log("Opening page...");
    await page.goto(url, { timeout: 0, waitUntil: ["domcontentloaded", "networkidle0"] });
    console.log("Page loaded.");
}
