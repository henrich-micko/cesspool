import React, { useEffect } from 'react'
import { Link, Navigate } from "react-router-dom"

// Context
import AuthContext from '../context/AuthContext'


interface Props {
    children: React.ReactNode,
    onEffect?: Function|null,
}

// If it's not authenticated view login link 
export const IsAuthenticatedView: React.FC<Props> = ({ children, onEffect = null }) => {
    const {isLogged} = React.useContext(AuthContext)

    useEffect(() => {
        if (onEffect !== null && isLogged) onEffect()
    })
 
    return(
        <>
            {isLogged 
                ? children
                : <Navigate to="/account/login" />
            }
        </>
    )
}


// If its authenticated view login link
export const IsNotAuthenticatedView: React.FC<Props> = ({ children, onEffect = null  }) => {
    const {isLogged} = React.useContext(AuthContext)

    useEffect(() => {
        if (onEffect !== null && !isLogged) onEffect()
    })

    return(
        <>
            {!isLogged 
                ? children
                : <Navigate to="/" />
            }
        </>
    )
}


// View contect only is user is authenticated
export const IsAuthenticated: React.FC<Props> = ({ children }) => {
    const {isLogged} = React.useContext(AuthContext)

    return (
        <>
            {isLogged ? children: null}
        </>
    )

}


// View content only if user is not authenticated
export const IsNotAuthenticated: React.FC<Props> = ({ children }) => {
    const {isLogged} = React.useContext(AuthContext)

    return (
        <>
            {!isLogged ? children: null}
        </>
    )

}