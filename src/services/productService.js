import api from './axios/axios.customize'

const GetAllProduct = () => {
    const URL_API = "/api/Product";
    return api.get(URL_API);
};
const GetProduct = (id) => {
    const URL_API = `/api/Product/${id}`;
    return api.get(URL_API);
};
const UpdateProduct = (id,data) => {
    const URL_API = `/api/Product/${id}`;
    return api.post(URL_API,data);
};
const CreateProduct = (data) => {
    const URL_API = "/api/Product";
    return api.post(URL_API, data);
};
const CreateProductImage = (id,data) => {
    const URL_API = `/api/Product/${id}/Image`;
    return api.post(URL_API, data);
};
const DeleteProduct = (id) => {
    const URL_API = `/api/Product/${id}`;
    return api.delete(URL_API);
};
const DeleteProductImage = (id) => {
    const URL_API = `/api/Product/${id}/Image`;
    return api.delete(URL_API);
};
const GetAllCategory = (id) => {
    const URL_API = `/api/Category`;
    return api.get(URL_API);
};
export {
    GetAllProduct,
    GetProduct,
    CreateProduct,
    CreateProductImage,
    UpdateProduct,
    DeleteProductImage,
    DeleteProduct,
    GetAllCategory
};