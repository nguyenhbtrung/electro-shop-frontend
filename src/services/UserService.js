import axiosInstance from './axios/axios.customize'
const url = '/api/User';

export const UserRegister = (data) => {
    return axiosInstance.post(url + '/register', data);
};

export const UserLogin = (data) => {
    return axiosInstance.post(url + '/login', data);
};

export const GetAllUsers = () => {
    console.log("GetAllUsers");
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
    return axiosInstance.get(`${url}` + `/user/${userName}`);
};

export const GetUserProfileDataAdmin = (userName) => {
    return axiosInstance.get(`${url}` + `/admin/${userName}`);
};

export const UpdateUser = (data) => {
    console.log(data);
    return axiosInstance.put(url + '/admin', data);
}

export const UserUpdate = (userName, data) => {
    return axiosInstance.put(`${url}` + `/user/${userName}`, data);
}

export const UpdateAvatar = (data) => {
    return axiosInstance.put(url + '/user/avatar?url=' + data);
}

export const ChangePassword = (data) => {
    return axiosInstance.put(url + '/changePassword', data);
}

export const SendForgotPasswordEmail = (data) => {
    return axiosInstance.post(url + '/forgotPassword?email=' + data);
}

export const ResetPassword = (data) => {
    return axiosInstance.put(url + '/resetPassword', data);
}

export const ConfirmEmail = (data) => {
    const encodedEmail = encodeURIComponent(data.email);
    const encodedToken = encodeURIComponent(data.token);
    const urlWithParams = `${url}/confirmedEmail?email=${encodedEmail}&token=${encodedToken}`;
    console.log("Url: ", urlWithParams);
    return axiosInstance.put(urlWithParams);
}