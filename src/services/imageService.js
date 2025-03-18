import api from './axios/axios.customize';

const UploadImage = (formData) => {
    const URL_API = "/api/Images/upload";
    return api.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const DeleteImage = (url) => {
    return api.delete('/api/Images/delete-by-url?imageUrl=' + url);
}

export {
    UploadImage,
    DeleteImage
};