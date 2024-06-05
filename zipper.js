const fs = require('fs');
const path = require('path');

const OUTPUT_DIRECTORY = 'docs';
const ZIP_DATA_PATH = 'raw_zip_data.json';

const main = async () => {
    // Clear current output directory
    fs.rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });

    // Create output directory
    const outputPath = path.join(OUTPUT_DIRECTORY, 'api', 'v1');
    fs.mkdirSync(outputPath, { recursive: true });

    // Copy index file
    const indexFile = 'index.html';
    fs.copyFileSync(indexFile, path.join(OUTPUT_DIRECTORY, indexFile));

    const zipData = JSON.parse(
        fs.readFileSync(ZIP_DATA_PATH, { encoding: 'utf-8' })
    );
    const zipDataKeys = Object.keys(zipData);

    for (let zipDatum of zipDataKeys) {
        const zip = zipData[zipDatum];
        fs.writeFileSync(
            path.join(outputPath, `${zip.zip}.json`),
            JSON.stringify(zip),
            { encoding: 'utf-8' }
        );
        fs.mkdirSync(path.join(outputPath, zip.zip));
        fs.writeFileSync(
            path.join(outputPath, zip.zip, 'index.html'),
            `<html>
    <head>
        <meta http-equiv="refresh" content="0; url=/api/v1/${zip.zip}.json" />
        <script type="text/javascript">
            window.location.href = "/api/v1/${zip.zip}.json"
        </script>
    </head>
    <body>
            <p><a href="/api/v1/${zip.zip}.json">Redirect</a></p>
    </body>
</html>`,
            { encoding: 'utf-8', recursive: true }
        );
    }
};

main();
