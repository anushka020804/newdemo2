import axiosInstance from './axiosInstance';

export const getDashboardKpis = async () => {
    const response = await axiosInstance.get('/dashboard/kpis');
    return response.data;
};

export const getDashboardActivities = async () => {
    const response = await axiosInstance.get('/dashboard/activities');
    return response.data;
};

export const getDashboardClosingSoon = async () => {
    const response = await axiosInstance.get('/dashboard/closing-soon');
    return response.data;
};

export const seedDashboardData = async () => {
    const response = await axiosInstance.post('/dashboard/seed');
    return response.data;
};