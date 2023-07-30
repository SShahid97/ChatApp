import axios from "axios";
export const APIClient = axios.create({
    baseURL: "http://127.0.0.1:5000",
    // baseURL: process.env.REACT_APP_BACK_END_BASE_URL
    // baseURL: "https://940b-117-210-156-156.ngrok-free.app"
});