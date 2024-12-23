import React, { useState, useEffect } from 'react';
import logo from '../../images/logo.png';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, refreshToken } from '../../api/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log(response);
      navigate(`/two-auth?email=${email}`);
    
        // if (response.data && response.data.token) {
        //     const { token, role, userId } = response.data;
        //     localStorage.setItem('token', token);
        //     localStorage.setItem('role', role);
        //       localStorage.setItem('userId', userId); 
        //     if (rememberMe) {
        //         localStorage.setItem('user', JSON.stringify({ email }));
        //     }
        // } else {
        //     alert('Invalid credentials');
        // }
    } catch (error) {
        console.error(error);
        alert('Invalid credentials');
    }
};


  // const checkTokenExpiry = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return;

  //   const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  //   const expiry = tokenPayload.exp * 1000;
  //   const now = Date.now();

  //   if (expiry - now < 5 * 60 * 1000) { // Refresh if the token will expire in less than 5 minutes
  //     try {
  //       console.log('Token about to expire:', token); // Debugging statement
  //       const response = await refreshToken(token);
  //       if (response.data && response.data.token) {
  //         console.log('Token refreshed successfully:', response.data.token); // Debugging statement
  //         localStorage.setItem('token', response.data.token);
  //       } else {
  //         console.log('Failed to refresh token');
  //       }
  //     } catch (error) {
  //       console.error('Failed to refresh token:', error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   if (user) {
  //     setEmail(user.email);
  //   }

  //   const interval = setInterval(checkTokenExpiry, 60 * 1000); // Check every minute

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     if (!rememberMe) {
  //       localStorage.removeItem('user');
  //     }
  //   };
  // }, [rememberMe]);

  return (
    <div className="grid grid-cols-2 items-center justify-center w-screen h-screen bg-white relative">
      <div className="relative w-full h-full flex items-center justify-center z-20">
        <div className="flex flex-col items-center justify-center w-full sm:w-[500px] mx-auto">
          <h1 className="text-3xl text-blue-600 mb-2 m-auto">Welcome back</h1>
          <p className="text-gray-400 mb-6">Enter your email and password to sign in</p>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-custom-blue background-image w-full h-full lg:w-auto lg:h-full rounded-bl-[25px] flex items-center justify-center z-10">
        <img src={logo} alt="Logo" className="w-45 h-32" />
      </div>
    </div>
  );
}
