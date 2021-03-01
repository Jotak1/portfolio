// import styled from '@emotion/styled';
import './Presentacion.css';
import { styled, makeStyles } from '@material-ui/core/styles';
import React,{useState} from 'react';
import { TypingStep } from "typing-effect-reactjs";
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    Titulo: {
        fontSize: "2rem",
        textAlign: 'center',
        // color: '#fff',
        // alignitems: 'center',
        margin: 'auto',
        // justifyitems: 'center',
    },
    Container: {
        display: 'flex',
        flexFlow: 'column',
        textAlign: 'center',
        color: '#fff',
        alignItems: 'center',
        margin: 'auto',
        justifyItems: 'center',
    },
    Boton: {
        background: (props) =>
        props.color === 'red'
          ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
          : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        height: 48,
        width: 200,
        textAlign: "center",
        transition: "background",
        transitionDuration: 2      ,
    
    }
  });

const sequence = [
    {
      content: "Hola!\nsoy Juan Pablo,\n",
      config: {
        styleClass: "typing",
      },
    },
    {
        content: 500,
        config: {
            styleClass: "typing", // Custom Style class
        },
    },
    {
        content: 400,
        config: {
            styleClass: "typing", // Custom Style class
        },
    },
    {
      content: "Desarrollador Front End",
      config: {
        styleClass: "typing",
      },
    },
  ];

  function MyButton(props) {
    const { color, ...other } = props;
    const classes = useStyles(props);
    return <Button className={classes.Boton} {...other} />;
  }

 
const Presentacion = () => {
    const [color, setColor] = useState("blue");
    const classes = useStyles();
    return ( 
        <div className={classes.Container}>
        <div className={classes.Titulo}>
            <TypingStep
                sequence={sequence}
                cursorColor={'#fff'}
                typeSpeed={100}
                element="h1"
                />
      </div>
            <MyButton color={color}
                onMouseEnter={() => setColor("red")}
                onMouseLeave={() => setColor("blue")}
            >Contáctame</MyButton>
      </div>
     );
}
 
export default Presentacion;