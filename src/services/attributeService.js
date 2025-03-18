import api from './axios/axios.customize';

const ProductPricing = (productId, selectedAttributeDetailIds) => {
  const URL_API = "/api/ProductPricing/calculate";
  return api.post(
    URL_API,
    { productId, selectedAttributeDetailIds },
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export { ProductPricing };
