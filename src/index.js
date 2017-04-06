import json from "./transform/json";
import office from "./transform/office";
import csv from "./transform/csv";
import xml from "./transform/xml";
import Saver from "./saver";
const charset = document.characterSet;
const uri = {
  json: "application/json;charset=" + charset,
  txt: "csv/txt;charset=" + charset,
  csv: "csv/txt;charset=" + charset,
  xml: "application/xml",
  doc: "application/msword",
  xls: "application/vnd.ms-excel",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};
const typeMap = {
  json: json,
  txt: csv,
  csv: csv,
  xml: xml,
  doc: office,
  xls: office,
  docx: ""
};
export default (content, name, type) => {
  const typeFunc = typeMap[type];
  if (typeof typeFunc !== "function") throw new Error("not supported" + type);
  Saver(name + "." + type, typeFunc(content), uri[type]);
};
