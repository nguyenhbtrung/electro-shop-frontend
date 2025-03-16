import api from './axios/axios.customize'

const GetAllRating = () => {
    const URL_API = "/api/Rating";
    return api.get(URL_API);
};
const GetRatingByProductId = (ProductId) => {
    const URL_API = `/api/Rating/product/${ProductId}`;
    return api.get(URL_API);
};
const GetRatingByUserId = (UserId) => {
    const URL_API = `/api/Rating/user/${UserId}`;
    return api.get(URL_API);
};
const CreateRating = (data) => {
    const URL_API = "/api/Rating";
    return api.post(URL_API, data);
};
const UpdateRating = (ProductId, data) => {
    const URL_API = `/api/Rating/${ProductId}`;
    return api.put(URL_API, data);
};
const DeleteRating = (ProductId) => {
    const URL_API = `/api/Rating/${ProductId}`;
    return api.delete(URL_API);
};

export {
    GetAllRating,
    GetRatingByProductId,
    GetRatingByUserId,
    CreateRating,
    UpdateRating,
    DeleteRating
};