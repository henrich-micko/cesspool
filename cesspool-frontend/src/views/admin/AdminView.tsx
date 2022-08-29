import React, { useState } from "react"
import { IsAdminView } from "../../permissions/Admin"
import { useParams } from "react-router-dom"

// styles
import styles from "./styles.module.scss"

// components && admin views
import AdminAccountView from "./AdminAccountView"
import AdminMachineView from "./AdminMachineView"
import AdminNavigation from "../../components/admin/AdminNavigation"

const AdminView: React.FC = () => {
    const { app } = useParams()
    console.log(app)
    const handlePlus = () => {

    }

    const handleRefresh = () => {

    }

    return(
        <IsAdminView>
            <AdminNavigation onPlus={() => {}} onRefresh={() => {}}/>

            <div className={styles.view}>
                {app === "account"
                    ? <AdminAccountView />
                    : app === "machine" && <AdminMachineView />
                }
            </div>
        </IsAdminView>
    )
}

export default AdminView