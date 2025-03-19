import api from './axios/axios.customize'

const Search = (productName) => {
  const URL_API = "/api/Filter/search";
  return api.get(URL_API, {
    params: {
      productName: productName,
    },
  });
};

export { Search };
