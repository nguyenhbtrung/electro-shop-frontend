import api from './axios/axios.customize'

const GetCategoryTree = () => {
    const URL_API = "/api/Category/tree";
    return api.get(URL_API);
};

export {
    GetCategoryTree
};