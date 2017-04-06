const head = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><table>";
const foot = "</table>";
const getFromObject = (obj, id) => {
  if (typeof id === "undefined") {
    id = 0;
  }
  const ret = [`<row id="${id}">`];
  Object.keys(obj).forEach(key => {
    ret.push(`<column>${obj[key]}</column>`);
  });
  ret.push("</row>");
  return ret.join("");
};
export default json => {
  let results = "";
  if (Array.isArray(json)) {
    let ret = "";
    json.forEach((j, idx) => {
      ret += getFromObject(j, idx);
    });
    results = ret;
  } else {
    results = getFromObject(json);
  }
  return head + results + foot;
};
