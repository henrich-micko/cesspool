import styled from "styled-components";


const ItemWrapper = styled.div`
    display: grid;
    grid-gap: 1rem;
    padding-bottom: 5em;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
`;

export default ItemWrapper;