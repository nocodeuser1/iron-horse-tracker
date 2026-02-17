const XLSX = require('xlsx');

const workbook = XLSX.readFile('Example Data.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== EXCEL DATA ANALYSIS ===\n');
console.log(`Sheet Name: ${sheetName}`);
console.log(`Total Rows: ${data.length}`);
console.log(`\nColumns:`, Object.keys(data[0] || {}));
console.log(`\n=== FIRST 3 ROWS ===`);
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Analyze unique values for key columns
if (data.length > 0) {
  console.log('\n=== UNIQUE VALUES ANALYSIS ===');
  const keys = Object.keys(data[0]);
  keys.forEach(key => {
    const uniqueValues = [...new Set(data.map(row => row[key]))].filter(v => v);
    if (uniqueValues.length < 20) {
      console.log(`\n${key}: ${uniqueValues.length} unique values`);
      console.log(uniqueValues.slice(0, 10));
    }
  });
}
