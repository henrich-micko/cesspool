import React, { createContext, useContext, useState } from "react"
import { MachineAdminType, MachineType, UserType } from "@types"
import useAxios from "@hooks/useAxios";
import AuthContext from "./AuthContext";

// Types

interface Type {
    machines: MachineType[]|null;
    machinesAdmin: MachineAdminType[]|null;
    users: UserType[]|null;
}

interface Values {
    getMachines(reload?: boolean): Type["machines"]
    getMachinesAdmin(reload?: boolean): Type["machinesAdmin"]
    getUsers(reload?: boolean): Type["users"]

    setMachine(machineCode: string, newItem: MachineType): Type["machines"]
    setMachineAdmin(machineCode: string, newItem: MachineAdminType): Type["machinesAdmin"]
    setUser(userEmail: string, newItem: UserType): Type["users"]

    refreshMachines(): Type["machines"]
    refreshMachinesAdmin(): Type["machinesAdmin"]
    refreshUsers(): Type["users"]

    getMachineByCode(machineCode: string): MachineType|null
    getMachineAdminByCode(machineCode: string): MachineAdminType|null
    getUserByEmail(userEmail: string): UserType|null

    getMachineByIndex(index: number): MachineType|null
    getMachineAdminByIndex(index: number): MachineAdminType|null
    getUserByIndex(index: number): UserType|null

    getMachinesLenght(): number|null
    getMachinesAdminLenght(): number|null
    getUsersLenght(): number|null
}

interface Props {
    children: React.ReactNode
}

// Context
const DataContext = createContext<Values>({} as Values)
export default DataContext

// Provider
export const DataContextProvider: React.FC<Props> = (props) => {
    const [machines, setMachines] = useState<Type["machines"]>(null)
    const [machinesAdmin, setMachinesAdmin] = useState<Type["machinesAdmin"]>(null) // only for admin
    const [users, setUsers] = useState<Type["users"]>(null)  // only for admin

    const { isLogged, user } = useContext(AuthContext)
    const axios = useAxios()

    // Refreshers
    
    const refreshMachines = (): Type["machines"] => {
        if (!isLogged) 
            setMachines(null)
        
        else axios.get("/machine/")
                  .then(res => setMachines(res.data))
                  .catch(error => console.log(error))

        return machines
    }

    const refreshMachinesAdmin = (): Type["machinesAdmin"] => {
        if (!user.is_superuser) 
            setMachinesAdmin(null)
        
        else axios.get("/admin/machine/")
             .then(res => setMachinesAdmin(res.data))
             .catch(error => console.log(error))

        return machinesAdmin
    }

    const refreshUsers = (): Type["users"] => {
        if (!user.is_superuser) 
            setUsers(null)
        
        else axios.get("/admin/account/")
             .then(res => setMachinesAdmin(res.data))
             .catch(error => console.log(error))

        return users
    }

    // Getters

    const getMachines = (reload: boolean = false): Type["machines"] => 
        reload || machines === null ? refreshMachines() : machines
    
    const getMachinesAdmin = (reload: boolean = false): Type["machinesAdmin"] => 
        reload || machinesAdmin === null ? refreshMachinesAdmin() : machinesAdmin
    
    const getUsers = (reload: boolean = false): Type["users"] => 
        reload ||  users === null ? refreshUsers() : users

    // Getters For Single

    const getMachineByCode = (machineCode: string): MachineType|null => {
        getMachines()
        if (machines === null) return null

        let output = null
        machines.forEach(item => { 
            if (item.code === machineCode) output = item
        })

        return output
    }

    const getMachineAdminByCode = (machineCode: string): MachineAdminType|null => {
        getMachinesAdmin()
        if (machinesAdmin === null) return null

        let output = null
        machinesAdmin.forEach(item => { 
            if (item.code === machineCode) output = item
        })

        return output
    }

    const getUserByEmail = (userEmail: string): UserType|null => {
        getUsers()
        if (users === null) return null

        let output = null
        users.forEach(item => { 
            if (item.email === userEmail) output = item
        })

        return output
    }

    // Setters

    const setMachine = (machineCode: string, newItem: MachineType): Type["machines"] => {
        let existed: boolean = false

        if (machines === null) setMachines([newItem])
        else setMachines(machines.map(item => {
            if (item.code === machineCode) { existed = true; return newItem }
            return item
        }))

        if (!existed) setMachines([newItem])

        return machines
    }

    const setMachineAdmin = (machineCode: string, newItem: MachineAdminType): Type["machinesAdmin"] => {
        let existed: boolean = false

        if (machinesAdmin === null) setMachinesAdmin([newItem])
        else setMachinesAdmin(machinesAdmin.map(item => {
            if (item.code === machineCode) { existed = true; return newItem }
            return item
        }))

        if (!existed) setMachinesAdmin([newItem])

        return machinesAdmin
    }

    const setUser = (userEmail: string, newItem: UserType): Type["users"] => {
        let existed: boolean = false

        if (users === null) setUsers([newItem])
        else setUsers(users.map(item => {
            if (user.email === userEmail) { existed = true; return newItem }
            return item
        }))

        if (!existed) setUsers([newItem])

        return users
    }

    // Get By Index

    const getMachineByIndex = (index: number): MachineType|null => {
        if (machines === null) return null
        const item = machines.at(index)
        return item !== undefined ? item : null
    }

    const getMachineAdminByIndex = (index: number): MachineAdminType|null => {
        if (machinesAdmin === null) return null
        const item = machinesAdmin.at(index)
        return item !== undefined ? item : null
    }

    const getUserByIndex = (index: number): UserType|null => {
        if (users === null) return null
        const item = users.at(index)
        return item !== undefined ? item : null
    }

    // Get Lenght

    const getMachinesLenght = (): number|null =>
        machines === null ? null : machines.length

    const getMachinesAdminLenght = (): number|null =>
        machinesAdmin === null ? null : machinesAdmin.length

    const getUsersLenght = (): number|null =>
        users === null ? null : users.length

    const values = {
        getMachines: getMachines,
        getMachinesAdmin: getMachinesAdmin,
        getUsers: getUsers,

        setMachine: setMachine,
        setMachineAdmin: setMachineAdmin,
        setUser: setUser,

        refreshMachines: refreshMachines,
        refreshMachinesAdmin: refreshMachinesAdmin,
        refreshUsers: refreshUsers,

        getMachineByCode: getMachineByCode,
        getMachineAdminByCode: getMachineAdminByCode,
        getUserByEmail: getUserByEmail,

        getMachineByIndex: getMachineByIndex,
        getMachineAdminByIndex: getMachineAdminByIndex,
        getUserByIndex: getUserByIndex,

        getMachinesLenght: getMachinesLenght,
        getMachinesAdminLenght: getMachinesAdminLenght,
        getUsersLenght: getUsersLenght
    }

    return (
        <DataContext.Provider value={values}>
            {props.children}
        </DataContext.Provider>
    )
}