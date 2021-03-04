import React from 'react';
import { Typing } from 'typing-effect-reactjs';
import '../index.css';
import { Grid, Slide } from '@material-ui/core';

const Proyectos = () => {
    return ( 
        <div className="contenedor">
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item xs={12} sm={6}>
                <Typing text={["Algunos Proyectos"]} element="h1" cursorThickness={0} />
                    <Slide direction="right" in={true}>
                        <p>
                        Desde proyectos
                        </p>
                    </Slide>
                </Grid>
            </Grid>
        </div>
     );
}
 
export default Proyectos;