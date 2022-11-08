import axios from "axios";
import { useContext } from "react";

import AuthContext from "@context/AuthContext";
import { apiUrl } from "../settings";

const useAxios = () => {
    const {authToken, isLogged, logoutUser} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL: apiUrl,
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
            if (authToken !== null && config.headers !== undefined) {
                config.headers.Authorization = "Token " + authToken
            }
            return config
        }
    )

    return axiosInstance
}

export default useAxios