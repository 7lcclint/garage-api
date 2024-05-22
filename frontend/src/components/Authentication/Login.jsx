import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Navbar from "../MainPage/Navbar";
import "./login.css";
function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigateTo = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3456/login", values)
      .then((response) => {
        console.log(response.data);
        if (response.data.Status === "Successfully") {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userType", response.data.user_type);
          localStorage.setItem("token", response.data.token);
          console.log("Before navigation");
          navigateTo("/");
          location.reload();
          console.log("After navigation");
        } else {
          alert("Error: " + (response.data.Error || "Unknown Error"));
        }
        alert("Successs");
      })
      .catch((error) => {
        console.log("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container-login">
        <div className="form-container">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="form-control rounded-0"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="form-control rounded-0"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="login-button">
              Log in
            </button>
            <p>Register ?</p>
            <Link to="/register" className="login-button-light">
              Create Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
