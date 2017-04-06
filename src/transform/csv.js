const fixCSVField = value => {
  var addQuotes = (value.indexOf(",") !== -1) || (value.indexOf("\r") !== -1) || (value.indexOf("\n") !== -1);
  var replaceDoubleQuotes = (value.indexOf("\"") !== -1);

  if (replaceDoubleQuotes) {
    value = value.replace(/"/g, "\"\"");
  }
  if (addQuotes || replaceDoubleQuotes) {
    value = "\"" + value + "\"";
  }
  return "\t" + value;
};
const getFromObject = obj => {
  const ret = [];
  Object.keys(obj).forEach(key => {
    ret.push(fixCSVField(obj[key]));
  });
  return ret.join(",") + "\r\n";
};
export default json => {
  if (Array.isArray(json)) {
    let ret = "";
    json.forEach(j => {
      ret += getFromObject(j);
    });
    return ret;
  } else {
    return getFromObject(json);
  }
};

