import axios from 'axios';
import fs from 'fs';
import path from 'path';

const scrapedDataPdf = path.join(__dirname, "src/repository/scraped-data/pdf");

const sendPdfToEndpoint = async (pdfFilePath) => {
  try {
    const pdfData = fs.readFileSync(pdfFilePath);

    const fileName = path.basename(pdfFilePath);

    const response = await axios.post('https://your.zilis.cloud/endpoint', pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    console.log(`PDF ${fileName} uploaded successfully:`, response.data);
  } catch (error) {
    console.error(`Error uploading PDF ${fileName}:`, error);
  }
};

const sendAllPdfsInDirectory = async () => {
  try {
    const files = fs.readdirSync(scrapedDataPdf);

    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    console.log(`Found ${pdfFiles.length} PDF files to upload.`);

    for (const file of pdfFiles) {
      const pdfFilePath = path.join(scrapedDataPdf, file);
      await sendPdfToEndpoint(pdfFilePath);
    }
  } catch (error) {
    console.error('Error reading PDF directory:', error);
  }
};

sendAllPdfsInDirectory();