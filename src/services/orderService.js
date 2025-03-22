import api from './axios/axios.customize'

const GetOrderByUser = (userId) => {
    const URL_API = "/api/Order/user/vieworder";
    return api.get(URL_API);
};

export {
    GetOrderByUser
};
