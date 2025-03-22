import api from './axios/axios.customize'

const GetOrderByUser = (userId) => {
    const URL_API = "/api/Order/user/vieworder";
    return api.get(URL_API);
};

const GetOrderByStatus = (status) => {
    const URL_API = "/api/Order/user/vieworderbystatus?status=successed";
    return api.get(URL_API);
}

export {
    GetOrderByUser,
    GetOrderByStatus
};
