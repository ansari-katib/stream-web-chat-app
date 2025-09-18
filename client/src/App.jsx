import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import NotificationPage from './pages/NotificationPage'
import OnboardingPage from './pages/OnboardingPage'
import SignUpPage from './pages/SignUpPage'
import CallPage from './pages/CallPage'

import { Toaster } from "react-hot-toast";

import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <> <PageLoader /> </>

  return (
    <>
      <div className='h-screen' data-theme={theme}>
        <BrowserRouter>
          <Routes>

            <Route path='/'
              element={isAuthenticated && isOnboarded
                ? (
                  <Layout showSidebar={true}>
                    <HomePage />
                  </Layout>

                )
                : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />}
            />

            <Route path='/signup'
              element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />

            <Route path='/login'
              element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />}
            />

            <Route
              path='/chat/:id'
              element={isAuthenticated && isOnboarded
                ? (
                  <Layout showSidebar={false}>
                    <ChatPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
                )} />

            <Route path='/notification'
              element={isAuthenticated && isOnboarded
                ? (
                  <Layout showSidebar={true}>
                    <NotificationPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
                )}
            />

            <Route path='/call/:id'
              element={isAuthenticated && isOnboarded
                ? <CallPage /> : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />}
            />

            <Route path='/onboarding'
              element={isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to={"/"} />
                )
              ) : <Navigate to={'/login'} />}
            />

          </Routes>
        </BrowserRouter>


        {/* for toast notification */}
        <Toaster />
      </div>
    </>
  )
}

export default App
