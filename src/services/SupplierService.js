import axiosInstance from './axios/axios.customize'
const url = '/api/Supplier';


export const GetAllSuppliers = () => {
	return axiosInstance.get(url);
};

export const AddSupplier = (data) => {
	return axiosInstance.post(url, data);
};

export const DeleteSupplier = (supplierId) => {
	return axiosInstance.delete(url + '?id=' + supplierId);
};

export const GetSupplier = (supplierId) => {
	return axiosInstance.get(url + `/${supplierId}`);
};

export const UpdateSupplier = (data) => {
	return axiosInstance.put(url + `?id=${data.supplierId}`, data);
};