import React, { useEffect, useState } from 'react'
import { AppBar, Avatar, Box, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import logoImg from '../../assets/images/logo.svg'
import MobileDrawer from './MobileDrawer';
import { logoutSuccess } from '../../../store/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';

function Header() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activeMenu, setMenu] = useState(null);
  const [userRole, setRoleName] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, loggedUser } = useSelector(state => state.auth)

  const { pathname } = useLocation();
  const location = window.location.href;
  const homePageUrl = location.endsWith(pathname) ? location.slice(0, -pathname.length) : location;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickMenu = (value) => {
    setAnchorElUser(null);
    setMenu(value);
  };

  let settings = ['Profile', 'Logout'];

  useEffect(() => {
    if (activeMenu === 'Logout') {
      dispatch(logoutSuccess());
      navigate('/login');
    }
    if (activeMenu === 'Profile') {
      navigate(`/profile`);
    }
  }, [logoutSuccess, navigate, activeMenu]);

  // function getName(name) {
  //   return name
  //     .split(' ')
  //     .map(word => word[0])
  //     .join('')
  //     .toUpperCase();
  // }

  function getName(name) {
    const words = name.split(' ');
    console.log('words', words);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return words
      .map(word => word[0])
      .join('').toUpperCase();
  }
  function capitalizeFirstLetter(string) {
    return string ? string[0].toUpperCase() + string.slice(1) : '';
  }

  useEffect(() => {
    if (isAuthenticated) {
      setRoleName(loggedUser.role)
      setUserName(capitalizeFirstLetter(loggedUser.name))
      setUserImage(loggedUser.image)
    }
  }, [isAuthenticated, loggedUser])

  return (
    <>
      <AppBar position="static" className="header_main">
        <Box component="div" className="app_bar_main site-container">
          <Toolbar disableGutters>
            <Box className="main_logo" sx={{ display: { xs: 'none', md: 'flex', } }}>
              <Box component="a" href={homePageUrl} >
                <img src={logoImg} className="logo" alt="" />
              </Box>
            </Box>
            <Box
              sx={{ display: { xs: 'flex', md: 'none' } }}
              className="mobile_drawer"
            >
              <MobileDrawer />
            </Box>
            <Box sx={{ flexGrow: 0 }} className="header_user">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '14px', float: 'right' }}>
                <Avatar
                  alt={userName}
                  src={userImage || userName}
                  // onClick={handleOpenUserMenu}
                  variant="square"
                  sx={{ width: 60, height: 60, backgroundColor: '#3621A0', borderRadius: 4, fontSize: 24, fontFamily: 'Roboto', fontWeight: 500 }}
                />
                <Box
                // sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', color: '#000', fontSize: 17, fontFamily: 'Roboto', fontWeight: 500, cursor: 'pointer' }}
                    onClick={handleOpenUserMenu}
                  >
                    {userName.split(' ')[0]}
                    {Boolean(anchorElUser) ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                  <Box sx={{ textTransform: 'capitalize', textAlign: 'start', color: '#737791', fontSize: 12, fontFamily: 'Roboto', fontWeight: 400 }}>
                    {userRole}
                  </Box>
                </Box>
              </Box>
              <Menu
                sx={{ mt: 7.5, minWidth: 150 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleClickMenu(setting)}
                  >
                    <Typography textalign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Box>
      </AppBar >
    </>
  );
}

export default Header