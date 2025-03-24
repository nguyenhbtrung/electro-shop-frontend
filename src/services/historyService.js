import api from './axios/axios.customize'

const GetProductViewHistories = () => {
    const URL_API = "/api/ProductViewHistory";
    return api.get(URL_API);
};
const GetProductViewHistoryById = (HistoryId) => {
    const URL_API = `/api/ProductViewHistory/${HistoryId}`;
    return api.get(URL_API);
};
const CreateProductViewHistory = (ProductId) => {
    const URL_API = `/api/ProductViewHistory/${ProductId}`;
    return api.post(URL_API);
};
const UpdateProductViewHistory = (data) => {
    const URL_API = `/api/ProductViewHistory/${HistoryId}`;
    return api.post(URL_API, data);
};
const DeleteProductViewHistory = (HistoryId, data) => {
    const URL_API = `/api/ProductViewHistory/${HistoryId}`;
    return api.delete(URL_API, data);
};
const DeleteAllProductViewHistories = () => {
    const URL_API = `/api/ProductViewHistory`;
    return api.delete(URL_API);
};

export {
    GetProductViewHistories,
    GetProductViewHistoryById,
    CreateProductViewHistory,
    UpdateProductViewHistory,
    DeleteProductViewHistory,
    DeleteAllProductViewHistories
};