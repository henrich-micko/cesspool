import React, { useEffect, useState } from "react"

import { IsAdminView } from "@permissions/Admin"
import TheNaviagtion from "@components/TheNaviagtion"
import MenuOfAccountAdmin from "@components/account/MenuOfAccountAdmin"
import { UserType } from "@types"
import useAxios from "@hooks/useAxios"
import styles from "@styles/views/admin/accountViewAdmin.module.scss"
import AccountBoardAdmin from "@components/account/AccountBoardAdmin"



const AdminViewAccount: React.FC = () => {
    const [users, setUsers] = useState<UserType[]|null>(null)
	const [userId, setUserId] = useState<number>(0) // -1 is reserved for new machine

    const axios = useAxios()

	const refreshData = () => {
		axios.get("/admin/account/")
			.then(res => setUsers(res.data))
			.catch(error => console.log(error))
    }

    useEffect(() => {
		refreshData()
	}, [])

	const setUser = (id: number, newUser: UserType) => {
		if (users === null) { return }

		setUsers(users.map((user, index) => {
			if (index === id) return newUser
			return user
		}))
	}

	const onCreate = (newUser: UserType) => {
		if (users !== null) setUsers([...users, newUser])
		else setUsers([newUser])

		if (users !== null) setUserId(users.length)
	}

	const user = (users !== undefined && userId !== -1) ? users?.at(userId) : undefined
	if (user === undefined && userId !== -1 && users !== null && users.length !== 0) setUserId(0)

    return (
        <IsAdminView>
			<TheNaviagtion>
				<MenuOfAccountAdmin 
					activate={userId}
					users={users}
					onClick={setUserId}
					onRefresh={refreshData} 
				/>
			</TheNaviagtion>

            <div className={styles.view}>
                {
					user !== undefined &&
					<>
						<div className={styles.machineWrapper}>
							<AccountBoardAdmin user={user} setUser={newUser => setUser(userId, newUser)} />
						</div>
					</>
				}
			</div>
        </IsAdminView>
    )
}

export default AdminViewAccount