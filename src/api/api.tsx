import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const checkoutAPI = {
    postEmail: (form:FormData) => instance.post('email', form, {
        headers: {
            'Content-Type': "multipart/form-data"
        },
    })
}
