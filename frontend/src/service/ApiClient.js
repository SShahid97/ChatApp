import axios from "axios";
export const APIClient = axios.create({
    baseURL: "http://127.0.0.1:5000",
    // baseURL: process.env.REACT_APP_BACK_END_BASE_URL
    // baseURL: "https://d168-117-210-145-79.ngrok-free.app"
});