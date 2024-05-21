import fs from "fs/promises";
import path from "path";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const jsonFolderPath = path.join("src/repository/scraped-data/json");
const pdfFolderPath = path.join("src/repository/scraped-data/pdf");

export async function jsonPdf() {
    try {
        const files = await fs.readdir(jsonFolderPath);
        const jsonFiles = files.filter(file => file.endsWith(".json"));

        for (const jsonFile of jsonFiles) {
            const inputFilePath = path.join(jsonFolderPath, jsonFile);
            const outputFilePath = path.join(pdfFolderPath, path.parse(jsonFile).name + ".pdf");

            try {
                const data = await fs.readFile(inputFilePath, "utf-8");
                const jsonData = JSON.parse(data);
                const doc = new PDFDocument();
                const pdfStream = createWriteStream(outputFilePath);

                doc.pipe(pdfStream);

                doc.fontSize(12).text("Scraped Data:", { underline: true }).moveDown();

                jsonData.scrapedData.forEach(item => {
                    for (let key in item) {
                        switch (key) {
                            case "h1":
                                doc.fontSize(12).text("# " + item[key]).moveDown();
                                break;
                            case "h2":
                                doc.fontSize(12).text("## " + item[key]).moveDown();
                                break;
                            case "h3":
                                doc.fontSize(12).text("### " + item[key]).moveDown();
                                break;
                            case "li":
                                doc.fontSize(12).text("• " + item[key]).moveDown();
                                break;
                            case "p":
                                doc.fontSize(12).text(item[key]).moveDown();
                                break;
                            default:
                                break;
                        }
                    }
                });

                doc.end();
                console.log("PDF file has been generated:", outputFilePath);
            } catch (err) {
                console.error("Error reading or processing file:", inputFilePath, err);
            }
        }
    } catch (err) {
        console.error("Error reading folder:", err);
    }
}

jsonPdf()