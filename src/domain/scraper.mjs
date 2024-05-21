import { readPreviousData, saveScrapedData } from "./fileOperations.mjs";
import { getPageName } from "../utils/pageName.mjs";
import { promises as fs } from 'fs';
import { parseStringPromise } from 'xml2js';

// Función encargada de scrapear los datos
export async function scrapePageData(page, pageURL) {
  await page.goto(pageURL);
  const pageTitle = await page.title();
  const pageContent = await page.content();
  const previousData = await readPreviousData(pageURL);

  if (previousData && previousData.pageContent === pageContent) {
    console.log("No changes in page content.");
  } else {
    const scrapedData = await extractScrapedData(page, pageContent);

    try {
      await saveScrapedData(pageTitle, pageURL, pageContent, scrapedData);
      console.log(`Scraped content saved for ${pageURL}`);
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  }
}

async function loadfilter() {
  const xmlData = await fs.readFile("src/repository/config/filter.xml", 'utf8');
  const filter = await parseStringPromise(xmlData);
  const tagsToIgnore = filter.filter.tagsToIgnore[0].tag;
  const notNeededContent = filter.filter.notNeededContent[0].content;
  return { tagsToIgnore, notNeededContent };
}

async function extractScrapedData(page, pageContent) {
  const { tagsToIgnore, notNeededContent } = await loadfilter();
  
  await page.setContent(pageContent);
  const elements = await page.$$("body *");
  const scrapedData = [];

  for (const element of elements) {
    const tagName = await element.evaluate((node) => node.tagName.toLowerCase());
    if (tagsToIgnore.includes(tagName)) continue;

    let textContent = await element.evaluate((node) => node.textContent.trim());
    if (textContent === "" || notNeededContent.includes(textContent)) continue;

    scrapedData.push({
      [tagName]: textContent,
    });
  }

  return scrapedData;
}