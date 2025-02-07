import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api-service";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    login(formData)
      .then(() => {
        // Si inicia sesión correctamente, vamos a Home
        navigate("/");
      })
      .catch((error) => {
        // Si hay error, mostrar un mensaje
        alert("Login failed: " + (error.response?.data.message || error.message));
      });
  };

  return (
    <div className="container mt-5">
    <h1 className="mb-4">Login</h1>
    <div className="row justify-content-center">
      <div className="col-md-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              className="form-control"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}