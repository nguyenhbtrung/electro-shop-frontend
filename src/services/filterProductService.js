import api from './axios/axios.customize'

const Search = (productName) => {
  const URL_API = "/api/Filter/search";
  return api.get(URL_API, {
    params: {
      productName: productName,
    },
  });
};
const FilterInCategory = (categoryId, priceFilter, brandId, ratingFilter) => {
  const URL_API = `/api/Filter/category`;
  return api.get(URL_API, {
    params: {
      categoryId: categoryId,
      priceFilter: priceFilter,
      brandId: brandId,
      ratingFilter: ratingFilter,
    },
  });
};
const FilterInBrand = (brandId, priceFilter, categoryId, ratingFilter) => {
  const URL_API = `/api/Filter/brand`;
  return api.get(URL_API, {
    params: {
      brandId: brandId,
      priceFilter: priceFilter,
      categoryId: categoryId,
      ratingFilter: ratingFilter,
    },
  });
};
export { Search, FilterInCategory,FilterInBrand };

