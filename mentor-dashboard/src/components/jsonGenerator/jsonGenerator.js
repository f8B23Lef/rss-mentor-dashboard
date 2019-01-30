// const fs = require('fs');
const XLSX = require('xlsx');
// if (typeof require !== 'undefined') XLSX = require('xlsx');

console.log('---json generate---');

const mentorWorkbook = XLSX.readFile('./src/components/jsonGenerator/resources/Mentor-students pairs.xlsx');
const pairsSheet = mentorWorkbook.Sheets.pairs;
const pairsSheetJson = XLSX.utils.sheet_to_json(pairsSheet);
const pairsLength = pairsSheetJson.length;
console.log('pairsSheetJson', pairsSheetJson, pairsLength);
const uniqueArray = pairsSheetJson.reduce((a, d) => {
  if (a.indexOf(d.interviewer) === -1) {
    a.push(d.interviewer);
  }
  return a;
}, []);
console.log('uniqueArray', uniqueArray, uniqueArray.length);
