import styled from '@emotion/styled';
import './Presentacion.css';
import React from 'react';
import { Typing, TypingStep } from "typing-effect-reactjs";

const Titulo = styled.div`
    display: flex;
    font-size: 3rem;
    text-align: center;
    color: #fff;
    align-items: center;
    font-family: 'Squada One', cursive;
    margin: auto;
    justify-items: center;
`;

const Presentacion = () => {
    return ( 
        <Titulo>
            <Typing
                text={[
                    "Hola, Soy Juan Pablo"
                ]}
                />
      
      </Titulo>
     );
}
 
export default Presentacion;