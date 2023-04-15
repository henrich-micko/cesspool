export const getCity = (location: string, defaultValue: string = ""): string => {
    const value = location.split("/").at(1);
    return value ? value : defaultValue;
} 

export const getDistrict = (location: string, defaultValue: string = ""): string => {
    const value = location.split("/").at(0);
    return value ? value : defaultValue;
}

export const getName = (email: string) => {
    const output = email.split(".").at(0);
    return output ? output : email;
}