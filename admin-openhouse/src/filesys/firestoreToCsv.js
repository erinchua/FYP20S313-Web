const db = require('./config/adminConfig');
const fs = require('fs');
const converter = require('json-2-csv');

const pathDir = `./${process.argv.slice(2)[0]}/`;
const args = process.argv.slice(2)[1];

async function convertJsonToCsv() {
    const snapshot = await db.collection(args).get().catch(err => {
        console.log(`Error occured: ${err}`)
    });
    const colData = snapshot.docs.map(doc => doc.data());
    console.log(colData);

    converter.json2csv(colData, (err, csv) => {
        if (err) return console.log(`${err} Error occured`);
        
        if (!fs.existsSync(pathDir)) fs.mkdirSync(pathDir);

        fs.writeFileSync(`${pathDir}${args}.csv`, csv, err => {
            if (err) return console.log(`${err} Error writing file`)
        });
    });
};
convertJsonToCsv();
