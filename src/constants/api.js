import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.2.110:3000",
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;
