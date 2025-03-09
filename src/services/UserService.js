import axiosInstance from './axios/axios.customize'
const url = '/api/User';

export const UserRegister = (data) => {
    return axiosInstance.post(url + '/register', data);
};

export const UserLogin = (data) => {
    return axiosInstance.post(url + '/login', data);
};

export const GetAllUsers = () => {
    return axiosInstance.get(url);
};

export const AddUser = (data) => {
    return axiosInstance.post(url + '/addUser', data);
};

export const DeleteUser = (userName) => {
    return axiosInstance.delete(url + '/admin', {
        params: { userName }
    });
};

export const GetUserProfileData = (userName) => {
    return axios.get(url + `/${userName}`);
};

