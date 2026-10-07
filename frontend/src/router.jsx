

import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import CustomerLayout from './customer/layout/CustomerLayout'

const Admin = lazy(() => import('./admin/pages'))
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'))

// ! customer pages

const Home = lazy(() => import('./customer/pages/Home'))
const Rooms = lazy(() => import('./customer/pages/Rooms'))
const RoomDetails = lazy(() => import('./customer/pages/RoomDetails'))
const Booking = lazy(() => import('./customer/pages/Booking'))
const BookingRecap = lazy(() => import('./customer/pages/Booking/Recap'))
const About = lazy(() => import('./customer/pages/About'))
const Services = lazy(() => import('./customer/pages/Services'))
const Gallery = lazy(() => import('./customer/pages/Gallery'))
const Contact = lazy(() => import('./customer/pages/Contact'))

const CustomerDataLayout = lazy(
  () => import('./customer/layout/CustomerDataLayout'),
)

// ! admin pages

const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const RoomManagement = lazy(() => import('./admin/pages/RoomManagement'))
const Login = lazy(() => import('./admin/pages/Login'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <CustomerDataLayout />,
        children: [
          {
            path: 'rooms',
            element: <Rooms />,
          },
          {
            path: 'rooms/:id',
            element: <RoomDetails />,
          },
          {
            path: 'booking',
            element: <Booking />,
          },
          {
            path: 'booking/recap',
            element: <BookingRecap />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Admin />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'rooms',
            element: <RoomManagement />,
          },
        ],
      },
    ],
  },
])

export default router