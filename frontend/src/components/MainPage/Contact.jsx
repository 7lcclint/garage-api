import Cover from './Cover';
import Footer from './Footer';
import Form from './Form';
import Navbar from './Navbar';

function Contact() {
  return (
    <div>
      <Navbar/>
      <Cover heading='ติดต่อ' text='หากต้องการให้เจ้าหน้าที่ผู้ชำนาญติดต่อกลับ กรุณาฝากข้อความ เราจะติดต่อกลับโดยเร็วที่สุด' />
      <Form/>
      <Footer/>
    </div>
    
  )
}

export default Contact
