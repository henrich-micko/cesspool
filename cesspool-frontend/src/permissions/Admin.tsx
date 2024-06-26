import React, { useEffect } from 'react'
import { Link, Navigate } from "react-router-dom"

// Context
import AuthContext from '../context/AuthContext'


interface Props {
    children: React.ReactNode,
    onEffect?: Function|null,
}

// If it's not admin redirect to home page
export const IsAdminView: React.FC<Props> = ({ children, onEffect = null }) => {
    const { user } = React.useContext(AuthContext)

    useEffect(() => {
        if (onEffect !== null && user !== null && user.is_staff) onEffect()
    }, [])
 
    return(
        <>
            {user !== null && user.is_staff 
                ? children
                : <Navigate to="/" />
            }
        </>
    )
}