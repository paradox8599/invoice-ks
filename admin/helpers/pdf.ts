import puppeteer from "puppeteer";

export async function pdfFromUrl(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulateMediaType("print");
  await page.goto(url);
  await page.waitForNetworkIdle();
  const pdfBUffer = await page.pdf({
    format: "a4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  return pdfBUffer;
}
