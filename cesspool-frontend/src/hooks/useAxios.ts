import axios from "axios";

import { useContext } from "react";

// Context
import AuthContext from "../context/AuthContext";


const useAxios = () => {
    const {authToken, isLogged, logoutUser} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL: "http://192.168.1.151:8000/api/",
        headers: {
            "Content-type": "application/json",
        },
    });

    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401 && isLogged) {
                logoutUser()
            }

            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.request.use(
        config => {
            console.log("go")

            if (authToken !== null && config.headers !== undefined) {
                config.headers.Authorization = "Token " + authToken
            }
            return config
        }
    )

    return axiosInstance
}

export default useAxios