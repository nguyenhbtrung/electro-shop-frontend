import api from './axios/axios.customize'
const UpdateProdcutImage= (id,data) => {
    const URL_API = `/api/Product/${id}/Image`;
    return api.put(URL_API,data);
};
const CreateProductImage = (id,data) => {
    const URL_API = `/api/Product/${id}/Image`;
    return api.post(URL_API, data);
};
const DeleteProductImage = (imageid) => {
    const URL_API = `/api/Product/Image/${imageid}`;
    return api.delete(URL_API);
};
export {
    UpdateProdcutImage ,
    CreateProductImage ,
    DeleteProductImage
};