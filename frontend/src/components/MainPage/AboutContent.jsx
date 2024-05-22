import { Link } from 'react-router-dom';
import './AboutContentStyle.css';
import repair1 from '../../assets/images/car-repair1.webp';
import repair2 from '../../assets/images/car-repair2.webp';

function AboutContent() {
  return (
    <div className='about white-text'>
      <div className='left'>
        <h1>เราคือ!?</h1>
        <p>อู่ซ่อมรถที่ให้บริการซ่อมและบำรุงรถยนต์ของลูกค้าที่มีปัญหาหรือขัดข้องต่าง ๆ</p>
        <Link to='/contact' className='btn-main'>ติดต่อเรา</Link>
      </div>
      <div className='right'>
        <div className='img-container'>
            <div className='img-stack top'>
                <img src={repair1} className='img' alt="true" />
            </div>
            <div className='img-stack bottom'>
                <img src={repair2} className='img' alt="true" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default AboutContent
