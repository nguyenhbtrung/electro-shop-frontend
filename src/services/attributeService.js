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
const AddAttributeToProduct=(productId,data)=>{
  const URL_API = `/api/Product/${productId}/addAttributeId`;
  return api.post(URL_API,data);
}
const UpdateAttributeDetail = (attributeId, detailId, data) => {
  const URL_API = `/api/ProductAttributes/${attributeId}/details/${detailId}`;
  return api.put(URL_API, data);
};
const DeleteAttribute =(attributeId)=>{
  const URL_API = `/api/ProductAttributes/${attributeId}`;
  return api.delete(URL_API);
}
export { ProductPricing,GetAllAttribute,CreateAttribute,CreateAttributeDetail,AddAttributeToProduct ,UpdateAttributeDetail,DeleteAttribute};
