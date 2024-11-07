import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Container, FormControl, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logoImg from '../assets/images/logo.svg'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/features/authSlice';
import { isTokenExpired } from '../helper/helper';

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { pathname } = useLocation();
  const { loading, isAuthenticated, token } = useSelector((state) => state.auth);
  const location = window.location.href;
  const homePageUrl = location.endsWith(pathname) ? location.slice(0, -pathname.length) : location;


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isAuthenticated && !isTokenExpired(token)) {
      navigate('/customers')
    }
  }, [isAuthenticated, token])

  return (
    <>
      <Box component={'section'} sx={{ backgroundColor: '#EEF0F8', }} id={'login_section'}>
        <Box sx={{ display: `flex`, justifyContent: `center`, alignItems: `center`, py: 2.2, }} >
          <Box component="a" href={homePageUrl}>
            <img src={logoImg} alt="Khaki app Logo" />
          </Box>
        </Box>
        <Container maxWidth="sm" sx={{ py: 10, }}>
          <Box sx={{ px: 5, py: 7.5, borderRadius: 5, backgroundColor: '#fff' }}>
            <Typography component="h4" sx={{ textAlign: 'center', fontFamily: 'Almarai', fontWeight: 700, fontSize: 30 }} gutterBottom>
              Login
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'Almarai', fontSize: 17, color: '#666666' }}>
              Please enter your credentials to access your account.
            </Typography>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email('Email is not valid')
                  .max(40, 'Maximum 40 characters')
                  .required('Email is required'),
                password: Yup.string()
                  .min(8, 'Password must be at least 8 characters')
                  .required('Required'),
              })}
              onSubmit={values => dispatch(login(values))}
            >
              {({ values }) => <Form className='log_in-form'>
                <FormControl className='form-control' fullWidth sx={{ mt: 3 }}>
                  <InputLabel
                    id="email-label"
                    htmlFor="email-input"
                  >
                    Email address<span className="required">*</span>
                  </InputLabel>
                  <Field
                    name="email"
                    as={TextField}
                    id="email-input"
                    type="text"
                    value={values.email || ''}
                  />
                  <ErrorMessage
                    name="email"
                    component={Typography}
                    color="error"
                    className="validation-error"
                  />
                </FormControl>
                <FormControl className='form-control' fullWidth sx={{ mt: 3 }}>
                  <InputLabel
                    id="password-label"
                    htmlFor="password-input"
                  >
                    Password<span className="required">*</span>
                  </InputLabel>
                  <Field
                    name="password"
                    as={TextField}
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password || ''}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>,
                    }}
                    sx={{ backgroundColor: '#E8F0FE', borderRadius: 2 }}
                  />
                  <ErrorMessage
                    name="password"
                    component={Typography}
                    color="error"
                    className="validation-error"
                  />
                </FormControl>
                <Button className='submit_btn' color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 4, }} disabled={loading} >
                  {loading ? <CircularProgress size={28} sx={{ color: '#fff' }} /> : 'Login'}
                </Button>
              </Form>}
            </Formik>
          </Box>

        </Container >
      </Box >
    </>
  );
}

export default LogIn