import api from './axios/axios.customize'

const GetOrderByUser = (userId) => {
    const URL_API = "/api/Order/user/vieworder";
    return api.get(URL_API);
};

const GetOrderByStatus = (status) => {
    const URL_API = "/api/Order/user/vieworderbystatus?status=successed";
    return api.get(URL_API);
}

const CancelOrder = (orderId) => {
    const URL_API = `/api/Order/admin/cancelorder/${orderId}`;
    return api.put(URL_API); 
};

const GetAllOrder = () => {
    const URL_API = "/api/Order/admin/allorders";
    return api.get(URL_API);
}

const UpdateOrderStatus = (orderId, orderStatus) => {
    const URL_API = `/api/Order/admin/updateorderstatus?orderId=${orderId}&orderStatus=${orderStatus}`;
    return api.put(URL_API); 
};

const RePay = (orderId) => {
    const URL_API = `/api/Order/user/repayment/${orderId}`;
    return api.put(URL_API); 
}

const DeleteOrder = (orderId) => {
    const URL_API = `/api/Order/admin/deleteorder/${orderId}`;
    return api.delete(URL_API); 
}

export {
    GetOrderByUser,
    GetOrderByStatus,
    CancelOrder,
    GetAllOrder,
    UpdateOrderStatus,
    RePay,
    DeleteOrder,
};
