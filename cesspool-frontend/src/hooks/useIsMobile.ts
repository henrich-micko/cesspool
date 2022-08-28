import { useMediaQuery } from "react-responsive"

const useIsMobile = (): boolean => {
    return useMediaQuery({ query: '(max-width: 660px)' });
}

export default useIsMobile