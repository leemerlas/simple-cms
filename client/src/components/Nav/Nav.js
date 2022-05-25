import React, { useState, useEffect } from "react";
import { 
    Grid, 
    IconButton,
    Button,
    AppBar,
    Box,
    Toolbar,
    Typography
} from '@mui/material'

const Nav = (props) => {

    useEffect(() => {

    }, [])

    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Castle Digital CMS
                    </Typography>
                    {props.showLogin ? 
                        <Button variant="outlined" onClick={props.openLogin} color="inherit">Login</Button>
                        :
                        <Typography>
                            {props.name}
                        </Typography>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Nav;