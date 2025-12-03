import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoginBG from '../assets/loginBG.png'

function LoginForm({ switchToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error when user starts typing
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        try {
            const response = await axios.post(
                'http://localhost:7000/api/auth/login', 
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            
            if (response.data.success) {
                // Save token and user data
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                
                // Redirect to dashboard or home page
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                    {error}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition duration-300">Forgot password?</a>
                    </div>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                            Signing In...
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
            
            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <span 
                        onClick={switchToRegister}
                        className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition duration-300"
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}

function RegistrationForm({ switchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        
        try {
            const response = await axios.post(
                'http://localhost:7000/api/auth/register', 
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            
            if (response.data.success) {
                setSuccess('Account created successfully! You can now sign in.')
                setFormData({ username: '', email: '', password: '' })
                
                // Auto switch to login after successful registration
                setTimeout(() => {
                    switchToLogin()
                }, 2000)
            }
        } catch (error) {
            console.error('Registration error:', error)
            setError(error.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Join us today</p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm">
                    {success}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        required
                        minLength="6"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                            Creating Account...
                        </div>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>
            
            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <span 
                        onClick={switchToLogin}
                        className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition duration-300"
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
      style={{ 
        backgroundImage: `url(${LoginBG})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Left Side - Welcome Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                NexTalk
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Join thousands of users who trust us with their journey. Sign in or create your account to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8 w-full">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex">
                <button
                  onClick={switchToLogin}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={switchToRegister}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Form Container with Animation */}
          <div className="w-full transition-all duration-500 ease-in-out transform hover:scale-105">
            {isLogin ? 
              <LoginForm switchToRegister={switchToRegister} /> : 
              <RegistrationForm switchToLogin={switchToLogin} />
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default AuthPage