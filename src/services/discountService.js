import api from './axios/axios.customize'

const GetDiscounts = () => {
    const URL_API = "/api/Discount";
    return api.get(URL_API);
};

const CreateDiscount = (data) => {
    const URL_API = "/api/Discount";
    return api.post(URL_API, data);
};

export {
    GetDiscounts,
    CreateDiscount
};