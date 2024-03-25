import puppeteer from "puppeteer";
import { renderToString } from "react-dom/server";
import React from "react";
import Footer from "../components/pdf/footer";

export async function pdfFromUrl(url: URL) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulateMediaType("print");
  await page.goto(url.href);
  await page.waitForNetworkIdle();
  const footer = renderToString(<Footer />);
  const pdfBUffer = await page.pdf({
    format: "a4",
    printBackground: true,
    preferCSSPageSize: true,
    omitBackground: false,
    displayHeaderFooter: true,
    footerTemplate: footer,
  });
  await browser.close();
  return pdfBUffer;
}
