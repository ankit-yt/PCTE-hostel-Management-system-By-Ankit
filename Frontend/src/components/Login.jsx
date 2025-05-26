// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role');
    setRole(selectedRole || ''); // Set the role from URL params
  }, [location]);

  const formFields = [
    { field: 'username', type: 'text' },
    { field: 'password', type: 'password' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/api/users/login`, {
        username: credentials.username,
        password: credentials.password,
        role // Include the role in the login request
      });

      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('studentId', response.data.studentId); 

      const userRole = JSON.parse(atob(response.data.token.split('.')[1])).role;

      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'warden':
          navigate('/warden/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#fff5f5] to-[#ffeaea]">

  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/dashboard/hostel3.png" 
      alt="Background"
      className="w-full h-full object-cover opacity-80 mix-blend-lighten"
    />
  </div>

  {/* Red Gradient Blobs */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-red-600 via-red-400 to-pink-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 right-20 w-96 h-96 bg-gradient-to-tr from-red-700 via-pink-300 to-yellow-400 opacity-30 rounded-full blur-2xl "></div>
  </div>

  {/* Light Leak Overlay */}
  {/* <div className="absolute w-full h-full bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-40 z-0"></div> */}

  {/* Login Glass Card */}
  <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 text-gray-800 flex flex-col items-center">

    <h2 className="text-3xl font-bold mb-2 text-red-600">Welcome Back</h2>
    <p className="text-sm text-gray-600 mb-6">
      {role ? `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Please login to continue'}
    </p>

    {/* Error Message */}
    {error && (
      <div className="bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-2 rounded-md w-full mb-4 text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {formFields.map((item, index) => (
        <div key={index}>
          <label className="block text-sm text-gray-700 mb-1">
            {item.field.charAt(0).toUpperCase() + item.field.slice(1)}
          </label>
          <input
            type={item.type}
            name={item.field}
            required
            value={credentials[item.field]}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
      >
        Login
      </button>
    </form>
  </div>
</div>

  
  
  );
}

export default Login;