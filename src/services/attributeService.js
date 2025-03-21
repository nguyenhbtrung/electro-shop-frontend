import api from './axios/axios.customize';

const ProductPricing = (productId, selectedAttributeDetailIds) => {
  const URL_API = "/api/ProductPricing/calculate";
  return api.post(
    URL_API,
    { productId, selectedAttributeDetailIds },
    { headers: { 'Content-Type': 'application/json' } }
  );
};
const GetAllAttribute =()=>{
  const URL_API = "/api/ProductAttributes";
  return api.get(URL_API);
}
export { ProductPricing,GetAllAttribute };
