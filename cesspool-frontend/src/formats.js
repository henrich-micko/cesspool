export const maxLenght = ({maxLenght, text, end = "..."}) => {
    if (text.length > maxLenght) text = Array.from(text).slice(0, maxLenght - 3).join("") + end
    return text
}