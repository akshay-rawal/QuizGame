import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from '../store/store.js';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utills/axios.js";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state to show user feedback
  const dispatch = useDispatch();
  const navigate = useNavigate();


  
  const handleLogin = async (e) => {
    
    e.preventDefault();
    setLoading(true);  // Set loading state to true when login starts

    try {
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data;
      if (user && accessToken) {
        dispatch(login({ user, token: accessToken, userId: user.userId }));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        navigate("/home");
      } else {
        alert("Login failed: Missing user or token in response");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred during login.";
      alert(errorMessage);
    } finally {
      setLoading(false);  // Set loading state to false after the request is finished
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <input
            type="email"
            placeholder="Email"
            id="email"
            autoComplete="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your Password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}  // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
