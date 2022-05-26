import React, { useEffect } from "react";
import { 
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
            <AppBar position="static" style={{ padding: '15px 0px 15px 0' }}>
                <Toolbar>
                    <img src='cd.png' alt="Castle Digital" width={64} style={{ marginRight: 10 }}/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CMS
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