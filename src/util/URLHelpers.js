const getUrlParamsMap = (url) => {
  const urlParamsMap = new Map();
  const urlSearchParams = new URLSearchParams(new URL(url).searchParams);
  urlSearchParams.forEach((value, key) => {
    urlParamsMap.set(key, value);
  });
  return urlParamsMap;
};

export {
  getUrlParamsMap
}