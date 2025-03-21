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

export const UpdateStock = (stockId, data) => {
	return axiosInstance.put(url + `/${stockId}`, data);
};

export const DeleteStock = (stockId) => {
	return axiosInstance.delete(url + '/' + stockId);
};

export const UpdateStockStatus = (stockId, data) => {
	console.log("data: ", data);
	return axiosInstance.put(url + '/status/' + stockId + "?status=" + data);
}
