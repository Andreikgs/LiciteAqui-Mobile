import axios from "axios";

const api = axios.create({
    baseURL: "http://10.136.32.131:3000",
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;
