import api from './axios/axios.customize'

export const CreateMessage = (data) => {
    const URL_API = "/api/SupportMessage";
    return api.post(URL_API, data);
};

export const GetAllUserLatestMessages = () => {
    const URL_API = "/api/SupportMessage/admin/all-users";
    return api.get(URL_API);
};

export const GetMessagesByUserId = (userId) => {
    const URL_API = `/api/SupportMessage/admin/${userId}`;
    return api.get(URL_API);
};

export const GetUserMessages = () => {
    const URL_API = `/api/SupportMessage/user`;
    return api.get(URL_API);
};