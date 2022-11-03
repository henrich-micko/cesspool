export const maxLength = (content: string, maxLenght: number): string => {
    return (
        content.length > maxLenght ? Array.from(content).slice(0, maxLenght - 1).join("") + "..." : content 
    )
}

export const maxLenghtEmail = (email: string, maxLenght: number): string|undefined  => {
    if (email.length > maxLenght) {
        const username = email.split("@").at(0)
        return username === undefined ? email : username
    }

    return email
}