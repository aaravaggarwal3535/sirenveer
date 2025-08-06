import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
// import Home from './pages/Home';
import Aboutpage from './pages/About';
import Login from './pages/Login';
import Homepage from './pages/Home';
import EmergencyRoutePage from './pages/realworldemo';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/Login', element: <Login /> },
      { path: '', element: <Aboutpage /> },
      {path:'/Home',element:<Homepage />},
      {path:'/demo',element:<EmergencyRoutePage />}
      // { path: '', element: <Home /> },
      // { path: 'Login', element: <Login /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
