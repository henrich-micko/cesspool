import { useMediaQuery } from "react-responsive"

export const useMaxWidth = (maxWidth: string) => {
    return useMediaQuery({ query: "(max-width: " + maxWidth +")" });
}

const useIsMobile = (): boolean => {
    return useMaxWidth("48em")
}

export default useIsMobile

export const useIsTablet = (): boolean => {
    return useMaxWidth("60em")
}

export const useIsDesktop = (): boolean => {
    return !useMaxWidth("60em")
}