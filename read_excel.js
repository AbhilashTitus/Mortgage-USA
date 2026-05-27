const XLSX = require('xlsx');
const wb = XLSX.readFile('Copy of Max Purchase Price Calculator v3.xlsx');
console.log('Sheet names:', wb.SheetNames);

wb.SheetNames.forEach(name => {
  const ws = wb.Sheets[name];
  const ref = ws['!ref'] || 'A1';
  const range = XLSX.utils.decode_range(ref);
  console.log('\n=== Sheet: ' + name + ' (Rows: ' + (range.e.r+1) + ', Cols: ' + (range.e.c+1) + ') ===');
  const data = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
  data.slice(0, 80).forEach((row, i) => {
    const trimmed = row.slice(0, 15);
    console.log('Row ' + (i+1) + ': ' + JSON.stringify(trimmed));
  });
});
