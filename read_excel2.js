const XLSX = require('xlsx');
const wb = XLSX.readFile('Copy of Max Purchase Price Calculator v3.xlsx');

// Read first sheet top rows
const ws1 = wb.Sheets[wb.SheetNames[0]];
const data1 = XLSX.utils.sheet_to_json(ws1, {header:1, defval:''});
console.log('=== Sheet 1: ' + wb.SheetNames[0] + ' - First 25 rows ===');
data1.slice(0, 25).forEach((row, i) => {
  console.log('Row ' + (i+1) + ': ' + JSON.stringify(row.slice(0,15)));
});

// Read all remaining sheets fully
for (let s = 1; s < wb.SheetNames.length; s++) {
  const name = wb.SheetNames[s];
  const ws = wb.Sheets[name];
  const ref = ws['!ref'] || 'A1';
  const range = XLSX.utils.decode_range(ref);
  console.log('\n=== Sheet: ' + name + ' (Rows: ' + (range.e.r+1) + ', Cols: ' + (range.e.c+1) + ') ===');
  
  // Show rows 80-120 for Data sheet
  if (name === 'Data') {
    const data = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
    data.slice(80, 160).forEach((row, i) => {
      console.log('Row ' + (i+81) + ': ' + JSON.stringify(row.slice(0,7)));
    });
  } else {
    const data = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
    data.slice(0, 100).forEach((row, i) => {
      console.log('Row ' + (i+1) + ': ' + JSON.stringify(row.slice(0,15)));
    });
  }
}

// Also check Sheet 1 rows 80-200
console.log('\n=== Sheet 1 continued: rows 80-200 ===');
data1.slice(80, 200).forEach((row, i) => {
  const hasData = row.some(c => c !== '');
  if (hasData) console.log('Row ' + (i+81) + ': ' + JSON.stringify(row.slice(0,15)));
});
