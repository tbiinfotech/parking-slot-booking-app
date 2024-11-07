import React from 'react'
import { Box, Typography } from '@mui/material'

export default function PersonMessage({ time, message }) {
  return (
    <Box sx={{ my: 1.4375, display: 'flex', justifyContent: 'start' }}>
      <Box sx={{ p: 2, bgcolor: '#f1f1f1', borderRadius: '16px 16px 16px 0', }}>
        <Typography variant="body2" sx={{ overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipsis', fontSize: 16, color: '#262333', fontWeight: 400, fontFamily: 'Roboto', textAlign: 'right' }}>
          {message}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.4, fontSize: 12, color: 'var(--text2)', fontWeight: 500, fontFamily: 'Roboto', }}>
          {time}
        </Typography>
      </Box>
    </Box>
  )
}
