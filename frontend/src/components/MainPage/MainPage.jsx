import './MainPageStyle.css';
import { Link } from 'react-router-dom';
import cover from '../../assets/cover.webp'
function MainPage() {
  return (
    <div className='hero'>
      <div className='mask'>
        <img className='into-img' src={cover} alt="" />
      </div>
      <div className='content'>
        <h1>ยินดีต้อนรับ</h1>
        <p>ให้บริการตรวจสภาพรถ เปลี่ยนถ่ายน้ำมันเครื่อง เปลี่ยนยางรถ เปลี่ยนกระจก ซ่อมรถบบคลัช เปลี่ยนแบตเตอรี่ และบริการอื่นๆ</p>
        <div>
            <Link to='/services' className='btn-main'>บริการ</Link>
            <Link to='/contact' className='btn-main btn-main-light'>ติดต่อเรา</Link>
        </div>
      </div>
    </div>
  )
}

export default MainPage
