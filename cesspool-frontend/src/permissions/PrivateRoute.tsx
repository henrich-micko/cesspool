import { Route, Navigate } from "react-router-dom"
import React, { useContext } from "react"
import AuthContext from "../context/AuthContext"

interface Props {
    children: React.ReactNode
}

const PrivateRoute: React.FC<Props> = ({ children, ...rest}) => {
    const {isLogged} = useContext(AuthContext)

    return(
        <Route {...rest}>
            {isLogged ? children : <Navigate to="/account/login" />}
        </Route>
    )

}

export default PrivateRoute