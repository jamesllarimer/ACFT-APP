const functions = require('firebase-functions');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
 

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.readCsv = functions.https.onRequest((request, response) => {
   fs.createReadStream("../public/excel/ACFT.csv")
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
 response.send(results);
});
