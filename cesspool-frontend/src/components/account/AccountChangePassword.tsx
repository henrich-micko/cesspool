import React, { useState } from "react"
import TheInput from "@components/form/TheInput"
import TheForm from "@components/form/TheForm"
import useAxios from "@hooks/useAxios"

interface Props {
    onSubmit(email: string): void
}

const AccountChangePassword: React.FC<Props> = (props) => {
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("")

    const [buttonLabel, setButtonLabel] = useState<string>("Poslať email")

    const axios = useAxios() 
    
    const handleSubmit = () => {
       axios.post("/account/reset-password/", {user: email})
            .then(() => { 
                setButtonLabel("Poslať znovu")
                setError("")
            })
            .catch(() => setError("Neplatný email"))
        props.onSubmit(email)
    }

    return (
        <TheForm onClick={handleSubmit} error={error} buttonLabel={buttonLabel}>
            <>
                <TheInput label="Email" onChange={setEmail} value={email} />
            </>
        </TheForm>
    )
}

export default AccountChangePassword