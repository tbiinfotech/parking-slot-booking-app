import React, { useState } from 'react'
import Header from '../../components/header/Header'
import { Box, Typography } from '@mui/material'
import Sidebar from '../../components/sidebar/Sidebar'

function MainLayout({ children }) {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //     return null;
  // }
  return (
    <>
      <Box className="layout_inner">
        <Header />
        <Box className="page_with_sidebar" sx={{ bgcolor: '#f7f7f7' }}>
          <Box
            className="sidebar_main"
            sx={{ display: { md: 'block', xs: 'none' } }}
          >
            <Sidebar />
          </Box>
          <Box className="pages_main">
            <Box className="page_content">
              {children}
            </Box>
            <Box className={`admin_footer`}>© 2024 USA MI Plaza. All rights reserved.</Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default MainLayout