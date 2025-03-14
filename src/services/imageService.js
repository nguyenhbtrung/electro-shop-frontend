import api from './axios/axios.customize';

const UploadImage = (formData) => {
    const URL_API = "/api/Images/upload";
    return api.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export {
    UploadImage
};