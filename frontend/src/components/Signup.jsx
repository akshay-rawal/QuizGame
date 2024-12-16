
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utills/axios";

function Signup() {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async ()=>{
try {
        const response = await api.post('/auth/signup',{
            username,
            email,
            password
        });
        console.log("Signup response:", response); // Log the successful response
        alert('signup successful please login');
        navigate('/')
        await api.get('/session');
} catch (error) {
  console.error("Signup error:", error); // Log the entire error
    alert(error.response.data.message || "An error occurred during signup.");
}

  }
return(
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}/>
            <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
           <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Signup
        </button>


          </div>
          </div>
)


}

export default Signup;
