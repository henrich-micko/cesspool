import styled from "styled-components";


const TheTable = styled.table`
    width: 100%;

    th {
        padding: 0.5em 1.5em;
        text-align: left;
        color: inherit;
        width: fit-content;
    }

    tr {
        color: #6A718A;
    }

    tr:first-child {
        color: white;
    }

    th:first-child {
        text-align: left;
    }

    th:last-child {
        text-align: right;
    }

    a {
        color: white;
    }
`;

export default TheTable;