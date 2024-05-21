import { chromium } from "playwright";
import { scrapePageData } from "./scraper.mjs";
import { jsonPdf } from "./jsonToPdf.mjs";
//import { sendPdfToEndpoint } from "./sendPdf.mjs";
import fs from 'fs';
import { parseStringPromise } from 'xml2js';

async function getPageURLsFromXML(filePath) {
  const xmlData = fs.readFileSync(filePath, 'utf-8');
  const result = await parseStringPromise(xmlData);
  const urls = result.urlset.url.map(entry => entry.loc[0]);
  return urls;
}

// Main function
async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const pageURLs = await getPageURLsFromXML("src/repository/config/pagesToScrap.xml");

    for (const url of pageURLs) {
      await scrapePageData(page, url);
    }
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }

  jsonPdf()
  // sendPdf()

}


main();

