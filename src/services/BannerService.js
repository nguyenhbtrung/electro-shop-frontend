import axiosInstance from './axios/axios.customize'
const url = '/api/Banner';


export const GetAllBanners = () => {
	return axiosInstance.get(url);
};

export const AddBanner = (data) => {
	return axiosInstance.post(url, data);
};

export const UpdateBanner = (data) => {
	return axiosInstance.put(url, data);
};

export const GetBanner = (bannerId) => {
	return axiosInstance.get(url + `/${bannerId}`);
};

export const DeleteBanner = (bannerId) => {
	return axiosInstance.delete(url + `/${bannerId}`);
};
