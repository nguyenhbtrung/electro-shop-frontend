import api from './axios/axios.customize'

const AddToCart = (productId, quantity) => {
    const URL_API = `/api/Cart/user/addtocart`;
    const params = {
        productId,
        quantity
    };
    return api.post(URL_API, null, { params });
};

export {
    AddToCart
};