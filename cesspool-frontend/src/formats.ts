export const getCity = (location: string|null): string|null => {
    if (location === null) 
        return null
    const value = location.split("/").at(1);
    return value ? value : null;
} 

export const getDistrict = (location: string|null): string|null => {
    if (location === null) 
        return null
    const value = location.split("/").at(0);
    return value ? value : null;
}

export const getName = (email: string) => {
    const output = email.split(".").at(0);
    return output ? output : email;
}