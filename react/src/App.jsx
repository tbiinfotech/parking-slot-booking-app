import { useState } from 'react'
import './App.css'
import "@fontsource/almarai";
import "@fontsource/almarai/300.css";
import "@fontsource/almarai/400.css";
import "@fontsource/almarai/700.css";
import '@fontsource/inter';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <ToastContainer position={'bottom-right'} />
      <RouterProvider router={router} />
    </>
  )
}

export default App
