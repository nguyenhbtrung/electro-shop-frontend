import axiosInstance from './axios/axios.customize'
const url = '/api/User';

export const UserRegister = (data) => {
    
    return axiosInstance.post(url + '/register', data);
};

export const UserLogin = (data) => {
    return axiosInstance.post(url + '/login', data);
};

// export const GetProfileData = (userName) => {
//     return axios.get(url + `/profile/by-username/${userName}`);
// };

// export const GetProfilePosts = (userName, PageNumber, config) => {
//     return axios.get(url + `/profile/by-username/${userName}/posts?PageNumber=${PageNumber}`, config);
// };
