const tpl = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:xls\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta charset=\"UTF-8\" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>table1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table><thead><tr>{{thead}}</tr></thead><tbody>{{tbody}}</tbody></table></body></html>";
// const getHeader = obj => {
//   let ret = "";
//   Object.keys(obj).forEach(key => {
//     ret += `<th>${obj[key]}</th>`;
//   });
//   return ret;
// };
const getFromObject = obj => {
  let ret = "";
  Object.keys(obj).forEach(key => {
    ret += `<tr><td style="vnd.ms-excel.numberformat:@">${obj[key]}</td></tr>`;
  });
  return ret;
};
export default json => {
  const strs = [];
  if (Array.isArray(json)) {
    json.forEach(j => {
      strs.push(getFromObject(j));
    });
  } else {
    strs.push(getFromObject(json));
  }
  return tpl.replace(/\{\{tbody\}\}/, strs.join(""));
};
