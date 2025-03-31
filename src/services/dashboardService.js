import api from './axios/axios.customize'

export const GetTotalRevenue = () => {
    return api.get(`/api/Dashboard/revenue`);
};

export const GetTotalImportFee = () => {
    return api.get(`/api/Dashboard/importfee`);
};

export const GetNewActiveUsersCount = () => {
    return api.get(`/api/Dashboard/new_user`);
};

export const GetLast12MonthsRevenue = () => {
    return api.get(`/api/Dashboard/revenue/last-12-month`);
};

export const GetTopSellingProducts = (topCount = 5) => {
    return api.get(`/api/Dashboard/top-selling?topCount=${topCount}`);
};