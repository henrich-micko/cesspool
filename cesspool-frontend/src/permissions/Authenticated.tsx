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
    const { user } = React.useContext(AuthContext);

    useEffect(() => {
        if (onEffect !== null && user !== null)
            onEffect();
    }, [])

    return(
        <>
            {user !== null
                ? children
                : <Navigate to="/" />
            }
        </>
    )
}


// If its authenticated view login link
export const IsNotAuthenticatedView: React.FC<Props> = ({ children, onEffect = null  }) => {
    const { user } = React.useContext(AuthContext)

    useEffect(() => {
        if (onEffect !== null && user === null)
            onEffect()
    }, [])

    return(
        <>
            {user === null
                ? children
                : <Navigate to="/" />
            }
        </>
    )
}
