const XLSX = require('xlsx');
const wb = XLSX.readFile('Copy of Max Purchase Price Calculator v3.xlsx');

console.log('All Sheet Names:', wb.SheetNames);
console.log('---');

wb.SheetNames.forEach(name => {
  const ws = wb.Sheets[name];
  const ref = ws['!ref'] || 'A1';
  const range = XLSX.utils.decode_range(ref);
  const data = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
  
  console.log('\n========== Sheet: ' + name + ' (Rows: ' + (range.e.r+1) + ', Cols: ' + (range.e.c+1) + ') ==========');
  
  // Print only non-empty rows
  data.forEach((row, i) => {
    const hasData = row.some(c => c !== '');
    if (hasData) {
      console.log('Row ' + (i+1) + ': ' + JSON.stringify(row.slice(0, 15)));
    }
  });
});
