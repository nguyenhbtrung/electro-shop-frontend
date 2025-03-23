import api from './axios/axios.customize'

const GetCategoryTree = () => {
    const URL_API = "/api/Category/tree";
    return api.get(URL_API);
};
const GetCategory = (id) => {
    const URL_API = `/api/Category/${id}`;
    return api.get(URL_API);
};
const GetAllCategories = () => {
    const URL_API = `/api/Category`;
    return api.get(URL_API);
};
const GetCategoryById = (categoryId) => {
    const URL_API = `/api/Category/${categoryId}`;
    return api.get(URL_API);
};
const UpdateCategory = (id,data) => {
    const URL_API = `/api/Category/${id}`;
    return api.put(URL_API,data);
};
const CreateCategory = (data) => {
    const URL_API = "/api/Category";
    return api.post(URL_API, data);
};
const DeleteCategory = (id) => {
    const URL_API = `/api/Category/${id}`;
    return api.delete(URL_API);
};
const GetProductByCategoryId = (id) => {
    const URL_API = `/api/Category/${id}/Product`;
    return api.get(URL_API);
};
export {
    GetCategoryById,
    GetCategoryTree,
    GetCategory,
    UpdateCategory,
    CreateCategory,
    DeleteCategory,
    GetAllCategories,
    GetProductByCategoryId
};