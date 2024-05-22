import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './register.css';
import Navbar from "../MainPage/Navbar";

function Register() {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    setPasswordMatch(values.password === values.confirmPassword);
  }, [values.password, values.confirmPassword]);

  const navigateTo = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(values.password);
    console.log(values.confirmPassword);

    if (!passwordMatch) {
      alert("Passwords do not match.");
      return;
    }

    if (!passwordMatch) {
      setPasswordError(true);
      return;
    }

    axios.post('http://localhost:3456/register', values, { withCredentials: true })
    .then(response => {
      console.log(response)
      if (response.data.Status === "Successfully"){
        navigateTo('/login')
      }else{
        alert("Error: " + response.data)
      }
    })
    .then(error => console.log(error));
  }

  return (
    <>
    <Navbar/>
      <div className="container-register">
        <div className="form-container">
          <h2>สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="name"><strong>ชื่อ</strong></label>
                  <input 
                    type="text" 
                    name="firstname" 
                    placeholder="ชื่อ" 
                    className="form-control rounded-0"
                    value={values.firstname}
                    onChange={handleChange}/>
              </div>
              <div>
                  <label htmlFor="name"><strong>นามสกุล</strong></label>
                  <input 
                    type="text" 
                    name="lastname" 
                    placeholder="นามสกุล" 
                    className="form-control rounded-0"
                    value={values.lastname}
                    onChange={handleChange}/>
              </div>
              <div>
                  <label htmlFor="email"><strong>อีเมล</strong></label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="อีเมล" 
                    className="form-control rounded-0"
                    value={values.email}
                    onChange={handleChange}/>
              </div>
              <div>
                  <label htmlFor="password"><strong>รหัสผ่าน</strong></label>
                  <input 
                    type="password"
                    name="password"
                    placeholder="รหัสผ่าน" 
                    className="form-control rounded-0"
                    value={values.password}
                    onChange={handleChange}/>
              </div>
              <div>
                  <label htmlFor="password"><strong>ยืนยันรหัสผ่าน</strong></label>
                  <input 
                    type="password"
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน" 
                    className="form-control rounded-0"
                    value={values.confirmPassword}
                    onChange={handleChange}/>
              </div>
              {!passwordError && !passwordMatch && <span className="error-message">Passwords do not match.</span>}
              <button type="submit" className="register-button">สมัครสมาชิก</button>
              <p>มีบัญชีผู้ใช้แล้ว ?</p>
              <Link to="/login" className="register-button-light">เข้าสู่ระบบ</Link>
          </form>
        </div>
      </div>
    </>
    
  )
}

export default Register
