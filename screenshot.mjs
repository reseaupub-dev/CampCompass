import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

await page.goto("http://localhost:3000/login", { waitUntil: "networkidle", timeout: 20000 });
await page.screenshot({ path: "screenshot-login.png" });
console.log("login OK");

await page.goto("http://localhost:3000/register", { waitUntil: "networkidle", timeout: 20000 });
await page.screenshot({ path: "screenshot-register.png" });
console.log("register OK");

await browser.close();
