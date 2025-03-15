import api from './axios/axios.customize'

const GetOrderByUser = () => {
    const URL_API = "/api/Order/user/vieworder";
    return api.get(URL_API);
};

export {
    GetOrderByUser
};