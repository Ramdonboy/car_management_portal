import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css'
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
     console.log(email);
     console.log(password); 
     if (!email || !password) {
    alert("Email and Password are required");
    return;
  }
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data)
    if(data.message=="Login successful"){
      localStorage.setItem("token", data.token);
      const role = data.user.role;

  if (role === "admin") {
    navigate("/dashboard");
  } else if (role === "user") {
    navigate("/userdashboard");
  } else if (role === "owner") {
    navigate("/owner");
  } else {
    alert("Unknown role");
  }
    }
    alert(data.message);
  };
  return (
    <div className="login-page">
      <div className="logo-circle">🚗</div>

      <h1 className="app-title">CarRent</h1>
      <p className="app-subtitle" >
        Welcome back! Please login to continue
      </p>

      <div className="login-card">
        <h2>Login</h2>
        <p className="card-subtitle">
          Enter your credentials to access your account
        </p>

        <label>Email</label>
        <input type="email" placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)  }/>


        <label>Password</label>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />      <span
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}

      </span> 
        </div>

         <button type="submit " onClick={handleLogin}>Sign in</button>
       
        <p className="register">
          Don't have an account?
          <span onClick={() => navigate("/register")} > Register here</span>
        </p>
        
      </div>
    </div>
  );
};

export default Login;
