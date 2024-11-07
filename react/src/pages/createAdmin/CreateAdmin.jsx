import React, { useState } from 'react'
import { Box, Button, CircularProgress, Grid2 as Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import * as Yup from 'yup'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function CreateAdmin() {
  const [loading, setLoading] = useState(false)
  const { token } = useSelector(state => state.auth)
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  }
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, 'Minimum 3 characters')
      .max(30, 'Maximum 30 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .max(30, 'Maximum 30 characters')
      .required('Last name is required'),
    email: Yup.string()
      .email('Email is not valid')
      .max(40, 'Maximum 40 characters')
      .required('Email is required'),
    role: Yup.string()
      .notOneOf(['select'], 'Please select valid role')
      .required('Role is required'),
  });
  return (
    <>
      <Box className={'create-admin'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ minWidth: { xs: '100%', md: '95%', lg: '74%' }, my: { xs: 2, md: 3, lg: 5 } }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, action) => {
              setLoading(true)
              try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-admin`, values, {
                  headers: { Authorization: `Bearer ${token}`, },
                });
                const { success, message } = response.data;
                if (!success) {
                  toast.error(message || 'Something went wrong')
                  return
                }
                action.resetForm();
                toast.success(message || 'User created successfully')
              } catch (error) {
                console.error('error', error);
                toast.error(error?.response?.data?.message || 'Something went wrong')
              } finally {
                setLoading(false)
              }
            }}
          >
            {({ values, errors, touched }) => <Form>
              <Box className="page_title" sx={{ p: 0, }}>
                <Typography variant="h3" component="h3">
                  Create Admin
                </Typography>
              </Box>
              <Box className={`pages_inner`} sx={{ p: { xs: 1.5, md: 3, lg: 5 }, boxShadow: '0px 4px 20px 0px #EEEEEE80' }} >
                <Grid container spacing={4} className='create-admin-form'>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box className='field'>
                      <InputLabel id='firstName-label'>First Name</InputLabel>
                      <Field
                        as={TextField}
                        error={Boolean(errors.firstName && touched.firstName)}
                        fullWidth
                        id="firstName-input"
                        type="text"
                        name='firstName'
                        placeholder='Enter first name'
                      />
                      <ErrorMessage
                        component={Typography}
                        name='firstName'
                        color='error'
                        className='validation-error'
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box className='field'>
                      <InputLabel id='lastName-label'>Last Name</InputLabel>
                      <Field
                        as={TextField}
                        error={Boolean(errors.lastName && touched.lastName)}
                        fullWidth
                        id="lastName-input"
                        name='lastName'
                        type="text"
                        placeholder='Enter last name'
                      />
                      <ErrorMessage
                        component={Typography}
                        name='lastName'
                        color='error'
                        className='validation-error'
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box className='field'>
                      <InputLabel id='email-label'>Email</InputLabel>
                      <Field
                        as={TextField}
                        error={Boolean(errors.email && touched.email)}
                        fullWidth
                        id="email-input"
                        name='email'
                        type="text"
                        placeholder='Enter email address'
                      />
                      <ErrorMessage
                        component={Typography}
                        name='email'
                        color='error'
                        className='validation-error'
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box className='field select'>
                      <InputLabel id="role-label">Select Role</InputLabel>
                      <Field
                        as={Select}
                        error={Boolean(errors.role && touched.role)}
                        fullWidth
                        id="role-select"
                        name='role'
                        value={values.role || 'select'}
                        IconComponent={ExpandMore}
                      >
                        <MenuItem value="select">Select</MenuItem>
                        <MenuItem value={'support'}>Support</MenuItem>
                        <MenuItem value={'finance'}>Finance</MenuItem>
                      </Field>
                      <ErrorMessage
                        component={Typography}
                        name='role'
                        color='error'
                        className='validation-error'
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2.5 }}>
                <Button type='submit' sx={{ fontSize: 16, fontFamily: 'Inter', fontWeight: 500, color: '#fff', bgcolor: '#3621a0', textTransform: 'none', width: 151, height: 56, borderRadius: 2 }} disabled={loading}>
                  {loading ? <CircularProgress size={25} sx={{ color: '#fff' }} /> : 'Create'}
                </Button>
              </Box>
            </Form>}
          </Formik>
        </Box>
      </Box >
    </>
  )
}
