import axiosInstance from './axios/axios.customize'
const url = '/api/Stock';


export const GetAllStocks = () => {
	return axiosInstance.get(url);
};

export const GetStock = (stockId) => {
	return axiosInstance.get(url + `/${stockId}`);
};

export const AddStock = (data) => {
	return axiosInstance.post(url, data);
};

export const UpdateStock = (data) => {
	return axiosInstance.put(url + `/${data.stockId}`, data);
};

export const DeleteStock = (stockId) => {
	return axiosInstance.delete(url + '/' + stockId);
};

export const UpdateStockStatus = (data) => {
	return axiosInstance.put(url + '/status/' + data.stockId, data);
}
