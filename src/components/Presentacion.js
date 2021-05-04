import "../index.css";
import { makeStyles } from "@material-ui/core/styles";
import React, {  useState  } from "react";
import { TypingStep } from "typing-effect-reactjs";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";


const useStyles = makeStyles({
  Titulo: {
    textAlign: "center",
    margin: "auto",
    color: "#21CBF3",
  },
  TituloMob: {
    fontSize: "1.2rem",
  },
  TituloDesk: {
    fontSize: "2rem",
  },
  
  Container: {
    display: "flex",
    flexFlow: "column",
    textAlign: "center",
    color: "#fff",
    alignItems: "center",
    margin: "auto",
    justifyItems: "center",
  },
  Boton: {
    background: (props) =>
      props.color === "green"
        ? "linear-gradient(45deg, #50e943 30%, #a6ff53 90%)"
        : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    height: 48,
    width: 200,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  BotonHi: {
    visibility: "hidden",
  },
  linkst: {
    color: "#fff",
    textDecoration: "none",
  },
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
];
const sequence1 = [
  {
    content: " ",
    config: {
      styleClass: "erase",
    },
  },
  {
    content: 5500,
    config: {
      styleClass: "erase",
    },
  },
  {
    content: "contactame",
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
    content: '<button class= "contactButton" > Contactame </button>',
    config: {
      styleClass: "typing",
    },
  },
  {
    content: " ",
    config: {
      styleClass: "erase",
    },
  },
];

function MyButton(props) {
  const { color, botonHide, ...other } = props;
  const classes = useStyles(props);
  if (botonHide) {
    return <Button className={classes.BotonHi} {...other} />;
  } else {
    return <Button className={classes.Boton} {...other} />;
  }
}


const Presentacion = ({matches}) => {
  const [color, setColor] = useState("blue");
  const [botonHide, setBotonHide] = useState(true);
  const [typing1, setTyping1] = useState(false);
  const classes = useStyles();


  const buttonHide = () => {
    setTimeout(() => {
      setBotonHide(false);
      setTyping1(true);
    }, 11500);
  };
  return (
    <div className={classes.Container}>
      <div className={`${classes.Titulo} ${!matches? classes.TituloMob : classes.TituloDesk}` }>
        <TypingStep
          sequence={sequence}
          cursorColor={"#fff"}
          typeSpeed={100}
          element="h1"
          disableBlinkingOnEnd={true}
          onLoad={buttonHide()}
        />
        {typing1 ? null : (
          <TypingStep
            sequence={sequence1}
            cursorColor={"#fff"}
            typeSpeed={80}
            element="h1"
          />
        )}
        <Link to="/contacto" className={classes.linkst}>
        <MyButton
          color={color}
          botonHide={botonHide}
          onMouseEnter={() => setColor("green")}
          onMouseLeave={() => setColor("blue")}
        >
          Contáctame
        </MyButton>
      </Link>
      </div>
      
     
    </div>
  );
};

export default Presentacion;
