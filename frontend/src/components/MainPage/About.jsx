import AboutContent from './AboutContent';
import Cover from './Cover';
import Footer from './Footer';
import Navbar from './Navbar';

function About() {
  return (
    <div>
      <Navbar/>
      <Cover heading='เกี่ยวกับเรา' text='ให้บริการซ่อมและบำรุงรถยนต์ของลูกค้าที่มีปัญหาหรือขัดข้องต่าง ๆ'/>
      <AboutContent/>
      <Footer/>
    </div>
    
  )
}

export default About
