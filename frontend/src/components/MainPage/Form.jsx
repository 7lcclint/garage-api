import './FormStyle.css';

function Form() {
  return (
    <div className='formmain'>
      <formmain action="">
        <labelmain htmlFor="">ชื่อ - สกุล</labelmain>
        <input type="text" name="" id="" />
        <labelmain htmlFor="">อีเมล</labelmain>
        <input type="email" name="" id="" />
        <labelmain htmlFor="">หัวข้อ</labelmain>
        <input type="text" name="" id="" />
        <labelmain htmlFor="">ข้อความ</labelmain>
        <textarea name="" id="" placeholder='กรุณาพิมพ์ข้อความ' rows="6"></textarea>
        <button className='btn-main' style={{color: 'white'}}>ส่ง</button>
      </formmain>
    </div>
  )
}

export default Form
