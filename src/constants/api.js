import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwid…Dg1fQ.3JSgcH8ZHdpbBNJcfVGDJBGYLFR_aKzkTszonEcTIGs`, 
    },
});

export default api;
