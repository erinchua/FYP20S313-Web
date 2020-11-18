const db = require('./config/adminConfig');
const fs = require('fs');
const converter = require('json-2-csv');

const pathDir = `./${process.argv.slice(2)[0]}/`;
const args = process.argv.slice(2)[1];

const csvFile = fs.readFileSync(`${pathDir}${args}.csv`, 'utf-8', err => {
    if (err) return console.log(`${err} Error occured`);
});

converter.csv2json(csvFile, (err, json) => {
    if (err) return console.log(`${err} Error occured`);
    console.log(json);

    // To Firestore
    json.forEach(elem => {
        db.collection('toJSONTest').doc(elem.id).set(elem).catch(err => {
            return console.log(err);
        })
    });
});
    