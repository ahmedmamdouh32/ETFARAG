import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import ScrollToTop from '@/components/common/ScrollToTop'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Details from '@/pages/Details'
import Search from '@/pages/Search'
import Favorites from '@/pages/Favorites'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'

import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <FavoritesProvider>
              <ScrollToTop />
              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="details/:id" element={<Details />} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="favorites"
                    element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </FavoritesProvider>
          </AuthProvider>
        </BrowserRouter>
        <ToastContainer position="top-right" theme="colored" />
      </ThemeProvider>
    </HelmetProvider>
  )
}
