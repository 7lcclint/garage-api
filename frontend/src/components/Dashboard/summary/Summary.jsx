import ChartBox from '../chartBox/ChartBox'
import './summary.css'
import PieChartBox from '../pieCartBox/PieChartBox';
import BigChartBox from '../bigChartBox/BigChartBox';
import TopBox from '../topbox/TopBox';

const Summary = () => {

  const chartBoxEmployee = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Total Employees",
    number: "11.238",
    dataKey: "users",
    percentage: 45,
    chartData: [
      { name: "Sun", users: 400 },
      { name: "Mon", users: 600 },
      { name: "Tue", users: 500 },
      { name: "Wed", users: 700 },
      { name: "Thu", users: 400 },
      { name: "Fri", users: 500 },
      { name: "Sat", users: 450 },
    ],
  };

  const chartBoxCustomers = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Total Customers",
    number: "11.238",
    dataKey: "users",
    percentage: 45,
    chartData: [
      { name: "Sun", users: 400 },
      { name: "Mon", users: 600 },
      { name: "Tue", users: 500 },
      { name: "Wed", users: 700 },
      { name: "Thu", users: 400 },
      { name: "Fri", users: 500 },
      { name: "Sat", users: 450 },
    ],
  };

  return (
    <div className="summary">
      <div className="box box1"><TopBox/></div>
      <div className="box box4"><PieChartBox/></div>
      <div className="box box5"><ChartBox {...chartBoxCustomers} /></div>
      <div className="box box6"><ChartBox {...chartBoxEmployee} /></div>
      <div className="box box7"><BigChartBox/></div>
    </div>
  )
}

export default Summary
