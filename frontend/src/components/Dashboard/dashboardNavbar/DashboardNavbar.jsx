import { Link, useNavigate } from "react-router-dom";
import "./dashboardNavbar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import noavatar from '../../../../public/noavatar.png';

function DashboardNavbar() {

  const [firstName, setFirstName ] = useState();
  const [lastName, setLastName ] = useState();
  const [profileImage, setProfileImage ] = useState();
  const navigateTo = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token || !localStorage.getItem("isLoggedIn")) navigateTo('/');
    console.log("isLoggedIn in dashboard nav",localStorage.getItem("isLoggedIn"));

    if(token){
      axios.get('http://localhost:3456/getUserDataByEmail', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.Status === "Successfully"){
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
        setProfileImage(response.data.profile_picture);
        console.log("res data",response.data);
      }else{
        console.log("res error",response.data.Error)
      }
    })
    .then(error => console.log(error));
    }
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to='/' ><span>GARAGE SYSTEM</span></Link>
      </div>
      <div className="icons">
        <div className="user">
          <img
            src={profileImage ? `/src/assets/profilePicture/${profileImage}` : noavatar }
            alt=""
          />
          <Link className='white-text' to='/dashboard/summary'>{firstName} {lastName}</Link>
        </div>
        <Link to='setting'>
          <img src="/settings.svg" alt="" className="icon" />
        </Link>
      </div>
    </div>
  )
}

export default DashboardNavbar
