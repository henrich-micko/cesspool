import React from "react"


import AdminNavigation from "@components/admin/AdminNavigation"
import { IsAdminView } from "@permissions/Admin"


const AdminAccountView: React.FC = () => {
    return (
        <IsAdminView>
			<AdminNavigation onPlus={() => {}} onRefresh={() => {}}/>
        </IsAdminView>
    )
}

export default AdminAccountView