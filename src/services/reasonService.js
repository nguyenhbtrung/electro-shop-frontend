import api from './axios/axios.customize'

const GetAllReturnReason = () => {
    const URL_API = "/api/ReturnReason";
    return api.get(URL_API);
};

const CreateReturnReason = (data) => {
    const URL_API = "/api/ReturnReason";
    return api.post(URL_API, data);
};
const UpdateReturnReason = (ReasonId, data) => {
    const URL_API = `/api/ReturnReason/${ReasonId}`;
    return api.put(URL_API, data);
};
const DeleteReturnReason = (ReasonId) => {
    const URL_API = `/api/ReturnReason/${ReasonId}`;
    return api.delete(URL_API);
};

export {
    GetAllReturnReason,
    CreateReturnReason,
    UpdateReturnReason,
    DeleteReturnReason
};