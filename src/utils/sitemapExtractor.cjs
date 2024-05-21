const fs = require('fs');
const https = require('https');

// En caso de necesitar cambiar el dominio, esto es lo unico que toca cambiar.
const url = "https://www.unisabana.edu.co/sitemap-pages.xml";
const folderPath = "src/repository/config/";

// Función que descarga el xml usando la dirección de dominio.
async function downloadXml(url, destination) {

    https.get(url, (response) => {
        let file = fs.createWriteStream(destination);

        response.pipe(file);

        file.on('finish', () => {
            file.close();
        });
    }).on('error', (err) => {
        fs.unlink(destination, () => {});
        console.error("Error downloading XML file:", err);
    });
}

// Create the folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Download the XML file
const filename = folderPath + "sitemap-pages.xml";
downloadXml(url, filename);
