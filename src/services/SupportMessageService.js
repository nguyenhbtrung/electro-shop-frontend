import api from './axios/axios.customize'

export const CreateMessage = (data) => {
    const URL_API = "/api/SupportMessage";
    return api.post(URL_API, data);
};