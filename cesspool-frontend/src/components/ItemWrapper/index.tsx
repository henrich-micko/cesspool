import styled, { StyledComponent } from "styled-components";


export function generateItemWrapper(respOn = 1200): StyledComponent<"div", any, {}, never> {
    return styled.div`
        display: grid;
        grid-gap: 1rem;
        padding-bottom: 5em;
        grid-template-columns: repeat(2, minmax(200px, 1fr));

        @media (max-width: ${respOn}px) {
            grid-template-columns: repeat(1, minmax(200px, 1fr));
        }
    `; 
};


const ItemWrapper = generateItemWrapper();
export default ItemWrapper;