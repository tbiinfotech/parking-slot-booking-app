import React, { useState } from 'react'
import { Box, Drawer, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import logoImg from '../../assets/images/logoHeader.svg'
import { Menu } from '@mui/icons-material';

function MobileDrawer() {
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const { pathname } = useLocation();
    const location = window.location.href;
    const homePageUrl = location.endsWith(pathname) ? location.slice(0, -pathname.length) : location;

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            className="mobile_drawer_output"
            role="presentation"
        >
            <Box
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
            >
                <Box className="mobile_logo">
                    <Box component="a" href={homePageUrl}>
                        <img src={logoImg} className='logo' alt='' />
                    </Box>
                </Box>
                <Sidebar />
            </Box>
        </Box>
    );

    const navigate = useNavigate();

    return (
        <Box>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>

                    <IconButton onClick={toggleDrawer(anchor, true)}
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        className="drawer_btn"
                    >
                        <Menu />
                    </IconButton>

                    <Drawer
                        className="drawer_main_div"
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </Box>
    );
}

export default MobileDrawer