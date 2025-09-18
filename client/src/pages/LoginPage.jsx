import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShipWheelIcon } from 'lucide-react'
import { login } from '../lib/api'
import { Link } from 'react-router'
import image from '../assets/AuthImage/chat_auth_image.jpg'
import useLogin from '../hooks/useLogin'

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const { loginMutation , isPending ,error } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }


  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* Form Signup left side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col' >
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className="size-9 text-primary" />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider '>Chatify</span>
          </div>
          {/* ERROR messagge if any */}
          {error && (
            <div className='alert alert-error mb-4' >
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold' >Welcome Back</h2>
                  <p className='text-sm opacity-70'>
                    Sign in to your account to continue your language journey
                  </p>
                </div>

                <div className='space-y-3'>

                  <div className='form-control w-full'>
                    <label className='label' >
                      <span className='label-text' >Email</span>
                    </label>
                    <input
                      type='email'
                      placeholder='enter your email'
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className='form-control w-full'>
                    <label className='label' >
                      <span className='label-text' >Password</span>
                    </label>
                    <input
                      type='password'
                      placeholder='enter your password'
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                </div>

                <button className='btn btn-primary w-full' type='submit' >
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'>Loading...</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don't have an account?{" "}
                    <Link to={"/signup"} className='text-primary hover:underline'>
                      Sign up
                    </Link>
                  </p>
                </div>

              </div>
            </form>
          </div>


        </div>

        {/* form right side  */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className=' relative aspect-square max-w-sm mx-auto'>
              <img src={image} alt='login image' className='w-full h-full' />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with language partner worldwide</h2>
              <p className='opacity-70' >
                Practice conversations, make friends, and improve your language skills together
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
