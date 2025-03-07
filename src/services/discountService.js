import api from './axios/axios.customize'

const GetDiscounts = () => {
    const URL_API = "/api/Discount";
    return api.get(URL_API);
};

const CreateDiscount = (data) => {
    const URL_API = "/api/Discount";
    return api.post(URL_API, data);
};

const DeleteDiscount = (id) => {
    const URL_API = `/api/Discount/${id}`;
    return api.delete(URL_API);
};

export {
    GetDiscounts,
    CreateDiscount,
    DeleteDiscount
};