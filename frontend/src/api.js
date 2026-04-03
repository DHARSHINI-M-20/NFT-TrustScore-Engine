import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/nfts";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchNFTs = async () => {
  const response = await api.get("/");
  return response.data;
};

export const fetchNFTById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const fetchTrustScore = async (id) => {
  const response = await api.get(`/${id}/score`);
  return response.data;
};

export const incrementView = async (id) => {
  const response = await api.post(`/${id}/view`);
  return response.data;
};

export const likeNFT = async (id) => {
  const response = await api.post(`/${id}/like`);
  return response.data;
};

export default api;
