import React from "react";
import styled from "styled-components";


const Page = styled.div`
    height: 100vh;
`;

export default Page;


export const SingleBoxPage = styled.div`
    display: flex;
    justify-content: center;
`;


export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6A718A;
`;


export const IconWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.5em;
    
    * {
        cursor: pointer;
    }
`;


export const HelpText = styled.div`
    margin: 0;
    text-align: left;
    font-size: 1em;
    color: #6A718A;
    
    a {
        color: inherit;
    }

    a:hover {
        color: #4FACF7;
    }
`;


export const Title = styled.h1`
    color: white;
`;


export const LinkWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: right;

    * {
        color: #6A718A;
        text-align: right;
    }
`;


export const SpaceBetweenWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
