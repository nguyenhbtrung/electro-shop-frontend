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
const CreateAttribute =(data)=>{
  const URL_API = "/api/ProductAttributes";
  return api.post(URL_API,data);
}
const CreateAttributeDetail =(attributeId,data)=>{
  const URL_API = `/api/ProductAttributes/${attributeId}/details`;
  return api.post(URL_API,data);
}
export { ProductPricing,GetAllAttribute,CreateAttribute,CreateAttributeDetail };
