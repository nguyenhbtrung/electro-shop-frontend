import api from './axios/axios.customize';

const GetAllReturns = () => {
    const URL_API = `/api/Return`;
    return api.get(URL_API);
};

const CreateReturnRequest = (formData) => {
    const URL_API = "/api/Return";
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return api.post(URL_API, formData, config);
};

const GetReturnDetailById = (returnId) => {
    const URL_API = `/api/Return/${returnId}`;
    return api.get(URL_API);
};

const GetUserReturnHistory = () => {
    const URL_API = `/api/Return/history`;
    return api.get(URL_API);
};

const GetReturnDetailByAdmin = (returnId) => {
    const URL_API = `/api/Return/admin/${returnId}`;
    return api.get(URL_API);
};

const UpdateReturnStatus = (returnId, data) => {
    const URL_API = `/api/Return/status/${returnId}`;
    return api.put(URL_API, data);
};

const Refund = (data) => {
    const URL_API = `/api/Return/Refund`;
    return api.post(URL_API, data);
};

const GetPaymentByOrderId = (orderId) => {
    const URL_API = `/api/Return/payment/${orderId}`;
    return api.get(URL_API);
};

export {
    CreateReturnRequest,
    GetReturnDetailById,
    GetUserReturnHistory,
    GetAllReturns,
    GetReturnDetailByAdmin,
    UpdateReturnStatus,
    Refund,
    GetPaymentByOrderId
};

