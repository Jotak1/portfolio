import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
      // height: 600,
    margin: 10,
    backgroundColor: '#141414',
    color: '#fff',
    borderRadius: 20,
  },
  media: {
    height: 220,
  },
  buttonStle: {
    backgroundColor: '#141414',
    color: '#21CBF3'
  },
  actionArea:{
    height: 350,
  },
});

export default function MediaCard({ proyecto }) {
  const classes = useStyles();
  const {Titulo, Descripcion, link, img} = proyecto;
  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.actionArea}>
        <CardMedia
          className={classes.media}
          image={img}
          title={Titulo}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {Titulo}
          </Typography>
          <Typography variant="body2" component="p">
           {Descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button href={link} target="blank" targetsize="small" className={classes.buttonStle}>
          Link  
        </Button>
      
      </CardActions>
    </Card>
  );
}
