export const getHeader = (headers, name) => {
  const res = headers.find((header) => header.name === name);
  return res !== undefined ? res.value : res;
};

export const plus = (num1, num2) => {
  return num1 + num2;
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
}