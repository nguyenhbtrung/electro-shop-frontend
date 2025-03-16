import api from './axios/axios.customize';

const CreateReturnRequest = (formData) => {
    const URL_API = "/api/Return";
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return api.post(URL_API, formData, config);
};

export {
    CreateReturnRequest
};

