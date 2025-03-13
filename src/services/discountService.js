import api from './axios/axios.customize'

const GetDiscounts = () => {
    const URL_API = "/api/Discount";
    return api.get(URL_API);
};

const CreateDiscount = (data) => {
    const URL_API = "/api/Discount";
    return api.post(URL_API, data);
};

const DeleteDiscount = (id) => {
    const URL_API = `/api/Discount/${id}`;
    return api.delete(URL_API);
};

const UpdateDiscount = (id, data) => {
    const URL_API = `/api/Discount/${id}`;
    return api.put(URL_API, data);
};

const GetDiscountedProducts = (discountId) => {
    const URL_API = `/api/Discount/${discountId}/products`;
    return api.get(URL_API);
};

const ApplyDiscount = (data) => {
    const URL_API = `/api/Discount/apply`;
    return api.post(URL_API, data);
};

export {
    GetDiscounts,
    CreateDiscount,
    DeleteDiscount,
    UpdateDiscount,
    GetDiscountedProducts,
    ApplyDiscount
};