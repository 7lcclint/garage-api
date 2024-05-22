import Footer from './Footer';
import Navbar from './Navbar';
import Cover from './Cover';
import Work from './Work';
function Services() {
  return (
    <div>
      <Navbar/>
      <Cover heading='บริการ' text='ตัวอย่างงานที่อู่ของเราสามารถให้บริการได้'/>
      <Work/>
      <Footer/>
    </div>
    
  )
}

export default Services
