import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

interface Props {
    children: React.ReactNode;
}

const IsAuthenticated: React.FC<Props> = ({ children }) => {
    const {isLogged} = useContext(AuthContext)

    return (
        <>
            {isLogged ? children: null}
        </>
    )

}

export default IsAuthenticated