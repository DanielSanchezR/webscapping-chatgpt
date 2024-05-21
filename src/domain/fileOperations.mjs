import fs from "fs/promises";
import path from "path";
import { getPageName } from "../utils/pageName.mjs";

const SAVED_FILES_DIR = "src/repository/scraped-data/json";

// Función para leer datos previamente guardados
export async function readPreviousData(pageURL) {
  const fileName = `scraped_${getPageName(pageURL)}.json`;
  try {
    const previousDataBuffer = await fs.readFile(path.join(SAVED_FILES_DIR, fileName));
    return JSON.parse(previousDataBuffer);
  } catch (error) {
    console.log("No previous data found for", pageURL);
    return null;
  }
}

//Función para guardar los datos en un json
export async function saveScrapedData(pageTitle, pageURL, pageContent, scrapedData) {
  const pageNameS = getPageName(pageURL)
  const fileName = `scraped_${pageNameS}.json`;
  const dataToSave = {
    pageTitle,
    pageURL,
    pageContent,
    scrapedData,
  };
  await fs.writeFile(path.join(SAVED_FILES_DIR, fileName), JSON.stringify(dataToSave, null, 2));
}
