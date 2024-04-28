export async function goToPage(page, url) {
    await page.goto(url, { timeout: 0, waitUntil: ["domcontentloaded", "networkidle0"] });
}
