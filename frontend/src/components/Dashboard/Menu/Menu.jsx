import { Link } from "react-router-dom";
import "./menu.css";
import profile from "../../../../public/profile.svg";
import user from "../../../../public/user.svg";
import orders from "../../../../public/order.svg";
import calendar from "../../../../public/calendar.svg";
/* import home from '../../../../public/home.svg'; */
import axios from "axios";
import { useEffect, useState } from "react";

const Menu = () => {
  const [userType, setUserType] = useState();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3456/getUserDataByEmail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.Status === "Successfully") {
            setUserType(response.data.user_type);
            console.log("user type : ", userType);
            console.log("ID :", response.data.user_id);
          } else {
            console.log(response.data.Error);
          }
        })
        .then((error) => console.log(error));
    }
  });

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3456/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.Status === "Successfully logged out") {
            localStorage.setItem("token", false);
            localStorage.setItem("isLoggedIn", false);
            localStorage.removeItem("userType");

            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("Logout Error:", error);
        });
    }
  };

  return (
    <div>
      {userType === 1 ? (
        <div className="menu">
          <div className="item" key={1}>
            <span className="title">Main</span>
            <Link to="setting" className="listItem">
              <img src={profile} alt="" />
              <span className="listItemTitle">ข้อมูลส่วนตัว</span>
            </Link>
            <Link to="calendar" className="listItem">
              <img src={calendar} alt="" />
              <span className="listItemTitle">รายการจองซ่อม</span>
            </Link>
            <Link to="repairHistory" className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="#ffffff"
              >
                <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              <span className="listItemTitle">รายการซ่อม</span>
            </Link>
            <Link to="promotions" className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                fill="#ffffff"
                style={{ height: "1.5rem" }}
              >
                <path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
              </svg>
              <span className="listItemTitle">โปรโมชั่น</span>
            </Link>
            <Link onClick={handleLogout} className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="#ffffff"
                style={{ height: "1.5rem" }}
              >
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
              </svg>
              <span className="listItemTitle">Logout</span>
            </Link>
          </div>
        </div>
      ) : userType === 2 ? (
        <div className="menu">
          <div className="item" key={1}>
            <Link to="setting" className="listItem">
              <img src={profile} alt="" />
              <span className="listItemTitle">Profile</span>
            </Link>
            <Link to="allreserve" className="listItem">
              <img src={calendar} alt="" />
              <span className="listItemTitle">รายการจองซ่อม</span>
            </Link>
            <Link to="repair" className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="#ffffff"
              >
                <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              <span className="listItemTitle">รายการซ่อม</span>
            </Link>
            <Link onClick={handleLogout} className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="#ffffff"
                style={{ height: "1.5rem" }}
              >
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
              </svg>
              <span className="listItemTitle">Logout</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="menu">
          <div className="item" key={1}>
            {/* <Link to='summary' className="listItem">
              <img src={home} alt="" />
              <span className="listItemTitle">Summary</span>
            </Link> */}
            <Link to="setting" className="listItem">
              <img src={profile} alt="" />
              <span className="listItemTitle">Profile</span>
            </Link>
            <Link to="employee" className="listItem">
              <img src={user} alt="" />
              <span className="listItemTitle">บัญชีพนักงาน</span>
            </Link>
            <Link to="promotions" className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                fill="#ffffff"
                style={{ height: "1.5rem" }}
              >
                <path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
              </svg>
              <span className="listItemTitle">โปรโมชั่น</span>
            </Link>
            <Link to="reports" className="listItem">
              <img src={orders} alt="" />
              <span className="listItemTitle">รายงานการซ่อม</span>
            </Link>
            <Link to="reportsPromotions" className="listItem">
              <img src={orders} alt="" />
              <span className="listItemTitle">รายงานโปรโมชั่น</span>
            </Link>
            <Link to="reportsRevenue" className="listItem">
              <img src={orders} alt="" />
              <span className="listItemTitle">รายงานรายรับ</span>
            </Link>
            <Link onClick={handleLogout} className="listItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="#ffffff"
                style={{ height: "1.5rem" }}
              >
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
              </svg>
              <span className="listItemTitle">Logout</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
