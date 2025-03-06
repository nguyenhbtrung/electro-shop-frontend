import api from './axios/axios.customize'

const GetDiscounts = () => {
    const URL_API = "/api/Discount";
    return api.get(URL_API);
};

export {
    GetDiscounts
};