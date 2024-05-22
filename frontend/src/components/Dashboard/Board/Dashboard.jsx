import Menu from '../Menu/Menu'
import DashboardNavbar from '../dashboardNavbar/DashboardNavbar'
import '../style/dashboardGlobal.css'
import {Outlet} from "react-router-dom";


function DashBoard() {
  const Layout = () => {
    return (
      <div className="dashboard-main">
        <DashboardNavbar />
        <div className="dashboard-container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  return <Layout/>
}

export default DashBoard
