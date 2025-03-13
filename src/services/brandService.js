import api from './axios/axios.customize'

const GetAllBrand = () => {
    const URL_API = "/api/Brand";
    return api.get(URL_API);
};

const UpdateBrand = (id,data) => {
    const URL_API = `/api/Brand/${id}`;
    return api.put(URL_API,data);
};
const CreateBrand = (data) => {
    const URL_API = "/api/Brand";
    return api.post(URL_API, data);
};
const DeleteBrand = (id) => {
    const URL_API = `/api/Brand/${id}`;
    return api.delete(URL_API);
};
const GetProductByBrandId = (id) => {
    const URL_API = `/api/Brand/${id}/Product`;
    return api.get(URL_API);
};
export {
    GetAllBrand ,
    UpdateBrand,
    CreateBrand,
    DeleteBrand,
    GetProductByBrandId
};