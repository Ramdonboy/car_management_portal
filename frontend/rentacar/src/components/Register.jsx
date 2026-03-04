import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // default
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rcbook: "null",
    license: "null",
    address: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "password") {
      if (value.length < 6) {
        setPasswordStrength("Weak");
      } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)) {
        setPasswordStrength("Strong");
      } else {
        setPasswordStrength("Medium");
      }
    }
  };

  // HANDLE REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (role === "user" && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (passwordStrength === "Weak") {
      newErrors.password = "Password is too weak";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: role,
        }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      alert("Backend server not running");
    }
  };

  return (
    <div className="container">
      <h1>CarRent</h1>
      <p className="subtitle">Create your account</p>

      <div className="card">
        <h2>Register</h2>

        {/* ROLE SELECTOR */}
        <div className="role-selector">
          <label>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>

          <label>
            <input
              type="radio"
              value="owner"
              checked={role === "owner"}
              onChange={() => setRole("owner")}
            />
            Owner
          </label>
        </div>

        <form onSubmit={handleRegister}>
          
          {/* ================= USER FORM ================= */}
          {role === "user" && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                maxLength="10"
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleChange(e);
                }}
                required
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </>
          )}

          {/* ================= OWNER FORM ================= */}
          {role === "owner" && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.company}
                onChange={handleChange}
                required
              />

              <label>Email </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label> Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />

              <label>place</label>
              <input
                type="teaxt"
                name="place"
                value={form.place}
                onChange={handleChange}
                required
              />
            
            <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                maxLength="10"
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleChange(e);
                }}
                required
              />
              <label>Upload Driving License</label>
          <input
            type="file"
            name="license"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.license && <p className="error">{errors.license}</p>}

          {/* RC Book Upload */}
          <label>Upload RC Book</label>
          <input
            type="file"
            name="rcbook"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.rcbook && <p className="error">{errors.rcbook}</p>}

              {errors.phone && <p className="error">{errors.phone}</p>}
            </>
          )}

          {/* ================= COMMON PASSWORD SECTION ================= */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {passwordStrength && (
            <p className={`strength ${passwordStrength.toLowerCase()}`}>
              Strength: {passwordStrength}
            </p>
          )}

          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;