import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getInspectors = async () => {
    const response = await api.get('/inspectors');
    return response.data;
};

export const updateInspector = async (id, data) => {
    const response = await api.put(`/inspectors/${id}`, data);
    return response.data;
};

export const getPendingSubmissions = async () => {
    const response = await api.get('/submissions');
    return response.data;
};

export const submitTraining = async (data) => {
    const response = await api.post('/submissions', data);
    return response.data;
};

export const deleteSubmission = async (id) => {
    const response = await api.delete(`/submissions/${id}`);
    return response.data;
};

export default api;
