import React from 'react'

// css
import './App.css'

// react router dom
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// pages
import Attendance from './pages/attendance/Attendance';
import Salary from './pages/Salary';

// layouts
import RootLayout from './layout/RootLayout';
import Home from './pages/home/Home';
import UserAttendance from './pages/attendance/UserAttendance';
import Payment from './pages/payment/Payment';


function App() {

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='/attendance' element={<Attendance/>}/>
        <Route path='/attendance/:id' element={<UserAttendance/>}/>
        <Route path='/payment' element={<Payment/>}/>
      </Route>
    )
  )

  return (
    <div className='App'>
      <RouterProvider router={routes}/>
    </div>
  )
}

export default App