import React, { useEffect, useState } from 'react';
import logo from '../../images/logo.png';
import './two-auth.css';
import { useNavigate } from 'react-router-dom';
import { confirmCodeAuthentication } from '../../api/authService';
import { useParams } from 'react-router-dom';
export default function TwoAuth() {
  const [email, setEmail] = useState('');
  const [twoFactor, setTwoFactor] = useState('');
  useEffect(() => {
   
  setEmail(window.location.search.replace('?email=', ''));
  console.log(email)  
  }, [
  ]);
  console.log(email);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await confirmCodeAuthentication(email, twoFactor);
      console.log(response);

    
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
              <label htmlFor="twoAuth" className="block text-sm font-medium text-gray-700">TwoAuth-code</label>
              <input
                id="twoAuth"
                name="twoAuth"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your twoAuth"
                value={twoFactor}
                onChange={(event) => setTwoFactor(event.target.value)}
              />
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
