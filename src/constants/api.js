import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.15.10:3000", // Altere para seu ip local mantendo a porta do .env da api
    headers: {
        "Content-Type": "application/json",
    },
});


export default api;