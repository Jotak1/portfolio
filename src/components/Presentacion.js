import styled from '@emotion/styled';
import './Presentacion.css'
import React from 'react';
import Typist from 'react-typist';

const Titulo = styled.div`
    font-size: 3rem;
    text-align: center;
    color: #fff;
    align-items: center;
    font-family: 'Squada One', cursive;
    margin: auto;
`;

const Presentacion = () => {
    return ( 
        <Titulo>
        <Typist  >
            Hola, Soy Juan Pablo <br/>Desarrollador Front End
      </Typist></Titulo>
     );
}
 
export default Presentacion;