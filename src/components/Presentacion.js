// import styled from '@emotion/styled';
import './Presentacion.css';
import { styled, makeStyles } from '@material-ui/core/styles';
import React,{useState} from 'react';
import { Typing, TypingStep } from "typing-effect-reactjs";
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
        transitionDuration: 2,        
    },
    BotonHi: {
      visibility: 'hidden',
    }
  });

const sequence = [
    {
      content: "Hola! soy Juan Pablo,\n",
      config: {
        styleClass: "typing",
      },
    },
    {
        content: 400,
        config: {
            styleClass: "typing", // Custom Style class
        },
    },
  
    {
      content: "Desarrollador Front End\n",
      config: {
        styleClass: "typing",
      },
    },
  ]
  const sequence1 = [
    {
      content: "Contrata",
      config: {
        styleClass: "typing",
      },
    },
    {
      content: -4,
      config: {
        styleClass: "wrong",
      },
    },
    {
      content: 'actame',
      config: {
        styleClass: "typing",
      },
    },
    {
      content: -10,
      config: {
        styleClass: "wrong",
      },
    },
    {
      content: '<button className="sexyButton">\nContactame</button>',
      config: {
        styleClass: "typing",
      },
    },
  ];

  function MyButton(props) {
    const { color, botonHide, ...other } = props;
    const classes = useStyles(props);
    if(botonHide){
      return <Button className={classes.BotonHi} {...other} />;
    }
    else {
      return <Button className={classes.Boton} {...other} />;
    }
  };


  
  
 
const Presentacion = () => {

    
    const [color, setColor] = useState("blue");
    const [botonHide, setBotonHide] = useState(true);
    const [typing1, setTyping1] = useState(true)
    const [style, setStyle] = useState([])
    const classes = useStyles();

    
 
    const buttonHide = () => {
      setTimeout(() => {
        setTyping1(false);
        typingHid();
      }, 5500);
    };
    const typingHid = () => {
      setTimeout(() => {
        setBotonHide(false);
        setTyping1(true);
      }, 6000);
  };
    return ( 
        <div className={classes.Container}>
        <div className={classes.Titulo}>
            <TypingStep
                sequence={sequence}
                cursorColor={'#fff'}
                typeSpeed={100}
                element="h1"
                disableBlinkingOnEnd={true}
                />
                {buttonHide()}
                {typing1 ? null : (<TypingStep
                  sequence={sequence1}
                  cursorColor={'#fff'}
                  typeSpeed={80}
                  element="h1"
                  />)
                  }
      </div>
            <MyButton color={color}
                botonHide={botonHide}
                onMouseEnter={() => setColor("red")}
                onMouseLeave={() => setColor("blue")}
            >Contáctame</MyButton>
      </div>
     );
}
 
export default Presentacion;