import React, { FC, createContext, useState, ReactNode, useEffect } from "react"
import axios from "axios"

import { ContextUserType } from "../types";

// Types for default values and defalut values for context
interface defaultValueTypes {
    loginUser(email: string, password: string, onError: Function|null): void;
    logoutUser(): void;
    createUser(email: string, password: string, onError: Function|null): void;
    logoutUserAll(onError: Function|null): void

    authToken: string | null;
    isLogged: boolean;
    user: ContextUserType
}


// Context
const AuthContext = createContext<defaultValueTypes>({} as defaultValueTypes)
export default AuthContext


// Provider for Context
export const AuthProvider: FC<{children: ReactNode}>= ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken")) // Private getter and setter
    const [isLogged, setIsLogged] = useState(authToken !== null) // Public getter and setter 
    const [user, setUser] = useState<ContextUserType>({} as ContextUserType)

    // set user after token is set
    useEffect(() => {
        if (authToken !== null) {
            axios.get("http://localhost:8000/api/account/whoami/", {headers: {Authorization: "Token " + authToken}})
                .then(res => setUser(res.data))
                .catch(error => error.response.status === 401 && logoutUser())
        } else setUser({email: null, is_active: null, is_superuser: null, date_joined: null})
    }, [authToken])


    const loginUser = async (email: string, password: string, onError: Function|null = null) => {        
        const data = {
            "username": email,
            "password": password
        }

        await axios.post("http://localhost:8000/api/account/login/", data)
            .then(res => {
                const token = res.data.token

                setAuthToken(token)
                localStorage.setItem("authToken", token)
                setIsLogged(true)

            }).catch(error => {
                if (onError !== null) onError(error)
            })
    }

    const logoutUser = () => {
        setAuthToken(null)
        localStorage.removeItem("authToken")
        setIsLogged(false)
    }

    const logoutUserAll = async (onError: Function|null = null) => {
        if (!isLogged) return

        axios.get("http://localhost:8000/api/account/logoutall/", {
            headers: {
                Authorization: "Token " + authToken
            }   
        })
            .then(res => logoutUser())
            .catch(error => {
                if (error.response.status === 401) logoutUser()
                else if (onError !== null) onError(error)
            })
    }

    const createUser = async (email: string, password: string, onError: Function|null) => {        
        const data = {
            "email": email,
            "password": password
        }
        
        await axios.post("http://localhost:8000/api/account/create/", data)
            .then(res => {
                const token = res.data.token

                setAuthToken(token)
                localStorage.setItem("authToken", token)
                setIsLogged(true)
            }).catch(error => {
                if (onError !== null) onError(error)
            })
    }

    const contextData = {
        loginUser: loginUser,
        logoutUser: logoutUser,
        createUser: createUser,
        logoutUserAll: logoutUserAll,

        isLogged: isLogged, 
        authToken: authToken,
        user: user
    }
    
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}