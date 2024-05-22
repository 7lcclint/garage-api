import { FaFacebook, 
         FaHome, 
         FaLinkedin, 
         FaMailBulk, 
         FaPhone, 
         FaTwitter } from 'react-icons/fa'
import './FooterStyle.css'

function Footer() {
  return (
    <div className='footer white-text'>
      <div className='footer-container'>
        <div className='left'>
            <div className='location'>
                <FaHome size={20} style={{color: 'white', marginRight: '2rem'}}/>
                <div>
                    <p>155/512 ต.ท่าชอนยาง อ.กันทรวิชัย<br/>จ.มหาสารคาม ประเทศไทย</p>
                </div>
            </div>
            <div className='phone'>
                <h4><FaPhone size={20} style={{color: 'white', marginRight: '2rem'}}/>012-345-6789</h4>
            </div>
            <div className='email'>
                <h4><FaMailBulk size={20} style={{color: 'white', marginRight: '2rem'}}/>info@garageservice.com</h4>
            </div>
        </div>

        <div className='right'>
            <h4>เกี่ยวกับเรา</h4>
            <p>ให้บริการซ่อมและบำรุงรถยนต์ของลูกค้าที่มีปัญหาหรือขัดข้องต่าง ๆ มีช่างรถที่ชำนาญความรู้และทักษะในการดูแลและซ่อมแซมรถยนต์
              บริการแก้ไขปัญหาทั่วไป เช่นการเปลี่ยนถ่ายน้ำมันเครื่อง การเปลี่ยนยางรถ การซ่อมแซมเครื่องยนต์ การซ่อมแซมระบบเบรก 
              และการซ่อมแซมระบบไฟฟ้าและอิเล็กทรอนิกส์ของรถยนต์ และบริการอื่นๆ</p>
            <div className='social'>
                <FaFacebook size={25} style={{color: 'white', marginRight: '2rem'}}/>
                <FaTwitter size={25} style={{color: 'white', marginRight: '2rem'}}/>
                <FaLinkedin size={25} style={{color: 'white', marginRight: '2rem'}}/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
