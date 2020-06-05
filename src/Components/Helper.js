export const getHeader = (headers, name) => {
  const header = headers.find((header) => header.name === name);
  return header !== undefined ? header.value : undefined;
};

export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const decodeHtml = (html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const removeQuote = (str) => {
  return str.replace(/['"]+/g, "");
};
