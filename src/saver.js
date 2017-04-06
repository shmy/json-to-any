const has = (browser) => {
  const ua = navigator.userAgent;
  if (browser === "ie") {
    const isIE = ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1;
    if (isIE) {
      const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(ua);
      return parseFloat(RegExp["$1"]);
    } else {
      return false;
    }
  } else {
    return ua.indexOf(browser) > -1;
  }
};
const _isEdge = () => /Edge/.test(navigator.userAgent);
const _isIE11 = () => {
  let iev = 0;
  const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  const trident = !!navigator.userAgent.match(/Trident\/7.0/);
  const rv = navigator.userAgent.indexOf("rv:11.0");

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
const getDownloadUrl = (content, type) => {
  const BOM = "\uFEFF";
  if (window.Blob && window.URL && window.URL.createObjectURL && !has("Safari")) {
    const data = new Blob([BOM + content], { type: type });
    return URL.createObjectURL(data);
  } else {
    return `data:${type};charset=utf-8,${BOM}${encodeURIComponent(content)}`;
  }
};

const download = (filename, content, type) => {
  if (has("ie") && has("ie") < 10) {
    // has module unable identify ie11 and Edge
    const oWin = window.top.open("about:blank", "_blank");
    oWin.document.charset = "utf-8";
    oWin.document.write(content);
    oWin.document.close();
    oWin.document.execCommand("SaveAs", filename);
    oWin.close();
  } else if (has("ie") === 10 || _isIE11() || _isEdge()) {
    const BOM = "\uFEFF";
    const csvData = new Blob([BOM + content], { type: type });
    navigator.msSaveBlob(csvData, filename);
  } else {
    const link = document.createElement("a");
    link.download = filename;
    link.href = getDownloadUrl(content, type);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(link.href), 5);
  }
};
export default download;
