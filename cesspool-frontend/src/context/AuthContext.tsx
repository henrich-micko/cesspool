import React, { FC, createContext, useState, ReactNode } from "react"


// Types for default values and defalut values for context
interface defaultValueTypes {
    loginUser(email: string, password: string): Promise<{status: number; isSuccessful: boolean; detail: any}>;
    isLogged: boolean;
}


// Context
const AuthContext = createContext<defaultValueTypes>({} as defaultValueTypes)
export default AuthContext


// Provider for Context
export const AuthProvider: FC<{children: ReactNode}>= ({ children }) => {
    const [authTokens, setAuthTokens] = useState(
        localStorage.getItem("authTokens") !== null 
            ? JSON.parse(localStorage.getItem("authTokens")!) 
            : null 
    )

    const [isLogged, setIsLogged] = useState(authTokens !== null)

    const loginUser = async (email: string, password: string): Promise<{status: number; isSuccessful: boolean; detail: any}> => {
        const response = await fetch("http://localhost:8000/api/account/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"email": email, "password": password})
        })

        const data = await response.json()
        
        if (response.status === 200) {
            setAuthTokens(data)
            localStorage.setItem("authTokens", JSON.stringify(data))
            setIsLogged(true)
        }

        const output = await Promise.resolve({
            status: response.status,
            isSuccessful: authTokens !== null,
            detail: data.detail
        })
        
        return output
    }

    const contextData = {
        loginUser: loginUser,
        isLogged: isLogged
    }
    
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}