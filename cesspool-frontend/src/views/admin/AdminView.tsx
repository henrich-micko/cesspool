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
    const { application } = useParams()
    
    const handlePlus = () => {

    }

    const handleRefresh = () => {

    }

    return(
        <IsAdminView>
            <div className={styles.view}>
                <AdminNavigation onPlus={handlePlus} onRefresh={handleRefresh} />

                {application === "account"
                    ? <AdminAccountView />
                    : application === "machine" && <AdminMachineView />
                }
            </div>
        </IsAdminView>
    )
}

export default AdminView