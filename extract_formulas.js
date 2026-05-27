const XLSX = require('xlsx');

// Read with formulas preserved
const wb = XLSX.readFile('Copy of Max Purchase Price Calculator v3.xlsx');

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const ref = ws['!ref'] || 'A1';
  const range = XLSX.utils.decode_range(ref);
  
  console.log('\n\n########## SHEET: ' + sheetName + ' ##########');
  console.log('Range: ' + ref);
  console.log('Merges: ' + JSON.stringify(ws['!merges'] || []));
  
  // Data validations
  if (ws['!dataValidation']) {
    console.log('Data Validations: ' + JSON.stringify(ws['!dataValidation']));
  }
  
  // Named ranges
  if (wb.Workbook && wb.Workbook.Names) {
    console.log('\nNamed Ranges:');
    wb.Workbook.Names.forEach(n => {
      console.log('  ' + n.Name + ' = ' + n.Ref + (n.Sheet !== undefined ? ' (Sheet: ' + n.Sheet + ')' : ''));
    });
  }
  
  // Print every cell with formula info
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      const cell = ws[addr];
      if (cell) {
        let info = 'Cell ' + addr + ': ';
        info += 'type=' + cell.t + ', ';
        if (cell.f) info += 'FORMULA="' + cell.f + '", ';
        if (cell.F) info += 'ARRAY_FORMULA="' + cell.F + '", ';
        info += 'value=' + JSON.stringify(cell.v);
        if (cell.w) info += ', formatted=' + cell.w;
        if (cell.z) info += ', numFmt=' + cell.z;
        console.log(info);
      }
    }
  }
});

// Also extract defined names at workbook level
if (wb.Workbook) {
  console.log('\n\n########## WORKBOOK METADATA ##########');
  if (wb.Workbook.Names) {
    console.log('Defined Names:');
    wb.Workbook.Names.forEach(n => {
      console.log('  ' + JSON.stringify(n));
    });
  }
  if (wb.Workbook.Sheets) {
    console.log('\nSheet metadata:');
    wb.Workbook.Sheets.forEach((s, i) => {
      console.log('  Sheet ' + i + ': ' + JSON.stringify(s));
    });
  }
}
