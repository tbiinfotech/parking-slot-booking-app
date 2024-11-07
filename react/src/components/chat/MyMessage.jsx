import React from 'react'
import { Box, Typography } from '@mui/material'

export default function MyMessage({ time, message }) {
  return (
    <Box sx={{ my: 1.4375, display: 'flex', justifyContent: 'end' }}>
      <Box sx={{ maxWidth: { xs: '90%', md: '85%', lg: '65%' }, p: 2, bgcolor: '#f1eeff', borderRadius: '16px 16px 0 16px', }}>
        <Typography variant="body2" sx={{ overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipsis', fontSize: 16, color: '#262333', fontWeight: 400, fontFamily: 'Roboto', textAlign: 'right' }}>
          {message}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, fontFamily: 'Roboto', }}>
          {time}
        </Typography>
      </Box>
    </Box>
  )
}
