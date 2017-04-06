'use strict';

var json = function (json) {
  try {
    return JSON.stringify(json);
  } catch (error) {
    return "{}";
  }
};

var tpl = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:xls\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta charset=\"UTF-8\" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>table1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table><thead><tr>{{thead}}</tr></thead><tbody>{{tbody}}</tbody></table></body></html>";
// const getHeader = obj => {
//   let ret = "";
//   Object.keys(obj).forEach(key => {
//     ret += `<th>${obj[key]}</th>`;
//   });
//   return ret;
// };
var getFromObject = function (obj) {
  var ret = "";
  Object.keys(obj).forEach(function (key) {
    ret += "<tr><td style=\"vnd.ms-excel.numberformat:@\">" + (obj[key]) + "</td></tr>";
  });
  return ret;
};
var office = function (json) {
  var strs = [];
  if (Array.isArray(json)) {
    json.forEach(function (j) {
      strs.push(getFromObject(j));
    });
  } else {
    strs.push(getFromObject(json));
  }
  return tpl.replace(/\{\{tbody\}\}/, strs.join(""));
};

var fixCSVField = function (value) {
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
var getFromObject$1 = function (obj) {
  var ret = [];
  Object.keys(obj).forEach(function (key) {
    ret.push(fixCSVField(obj[key]));
  });
  return ret.join(",") + "\r\n";
};
var csv = function (json) {
  if (Array.isArray(json)) {
    var ret = "";
    json.forEach(function (j) {
      ret += getFromObject$1(j);
    });
    return ret;
  } else {
    return getFromObject$1(json);
  }
};

var head = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><table>";
var foot = "</table>";
var getFromObject$2 = function (obj, id) {
  if (typeof id === "undefined") {
    id = 0;
  }
  var ret = [("<row id=\"" + id + "\">")];
  Object.keys(obj).forEach(function (key) {
    ret.push(("<column>" + (obj[key]) + "</column>"));
  });
  ret.push("</row>");
  return ret.join("");
};
var xml = function (json) {
  var results = "";
  if (Array.isArray(json)) {
    var ret = "";
    json.forEach(function (j, idx) {
      ret += getFromObject$2(j, idx);
    });
    results = ret;
  } else {
    results = getFromObject$2(json);
  }
  return head + results + foot;
};

var has = function (browser) {
  var ua = navigator.userAgent;
  if (browser === "ie") {
    var isIE = ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1;
    if (isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(ua);
      return parseFloat(RegExp["$1"]);
    } else {
      return false;
    }
  } else {
    return ua.indexOf(browser) > -1;
  }
};
var _isEdge = function () { return /Edge/.test(navigator.userAgent); };
var _isIE11 = function () {
  var iev = 0;
  var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  var trident = !!navigator.userAgent.match(/Trident\/7.0/);
  var rv = navigator.userAgent.indexOf("rv:11.0");

  if (ieold) {
    iev = Number(RegExp.$1);
  }
  if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
    iev = 10;
  }
  if (trident && rv !== -1) {
    iev = 11;
  }

  return iev === 11;
};
var getDownloadUrl = function (content, type) {
  var BOM = "\uFEFF";
  if (window.Blob && window.URL && window.URL.createObjectURL && !has("Safari")) {
    var data = new Blob([BOM + content], { type: type });
    return URL.createObjectURL(data);
  } else {
    return ("data:" + type + ";charset=utf-8," + BOM + (encodeURIComponent(content)));
  }
};

var download = function (filename, content, type) {
  if (has("ie") && has("ie") < 10) {
    // has module unable identify ie11 and Edge
    var oWin = window.top.open("about:blank", "_blank");
    oWin.document.charset = "utf-8";
    oWin.document.write(content);
    oWin.document.close();
    oWin.document.execCommand("SaveAs", filename);
    oWin.close();
  } else if (has("ie") === 10 || _isIE11() || _isEdge()) {
    var BOM = "\uFEFF";
    var csvData = new Blob([BOM + content], { type: type });
    navigator.msSaveBlob(csvData, filename);
  } else {
    var link = document.createElement("a");
    link.download = filename;
    link.href = getDownloadUrl(content, type);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { return window.URL.revokeObjectURL(link.href); }, 5);
  }
};

var charset = document.characterSet;
var uri = {
  json: "application/json;charset=" + charset,
  txt: "csv/txt;charset=" + charset,
  csv: "csv/txt;charset=" + charset,
  xml: "application/xml",
  doc: "application/msword",
  xls: "application/vnd.ms-excel",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};
var typeMap = {
  json: json,
  txt: csv,
  csv: csv,
  xml: xml,
  doc: office,
  xls: office,
  docx: ""
};
var index = function (content, name, type) {
  var typeFunc = typeMap[type];
  if (typeof typeFunc !== "function") { throw new Error("not supported" + type); }
  download(name + "." + type, typeFunc(content), uri[type]);
};

module.exports = index;
