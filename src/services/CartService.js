import api from './axios/axios.customize'

const AddToCart = (productId, quantity) => {
    const URL_API = `/api/Cart/user/addtocart`;
    const params = {
        productId,
        quantity
    };
    return api.post(URL_API, null, { params });
};

export const GetUserCart = (userId) => {
    const URL_API = `/api/Cart/user/viewcart`;
    return api.get(URL_API);
};

export const DeleteCartItem = async (productId) => {
    return await api.delete(`/api/Cart/user/deletecartitem?productId=${productId}`);
  };

export const EditCartItemQuantity = async (productId, quantity) => {
    return await api.put(`/api/Cart/user/editcartitemquantity?productId=${productId}&quantity=${quantity}`);
};

export {
    AddToCart
};