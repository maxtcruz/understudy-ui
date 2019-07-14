import Cookies from 'universal-cookie';

const setCookie = (name, value, options) => {
  const cookies = new Cookies();
  cookies.set(name, value, options);
};

const getCookie = (name) => {
  const cookies = new Cookies();
  return cookies.get(name);
};

const removeCookie = (name, options) => {
  const cookies = new Cookies();
  cookies.remove(name, options);
};

const CookieHelpers = {
  setCookie,
  getCookie,
  removeCookie
};

export default CookieHelpers;
