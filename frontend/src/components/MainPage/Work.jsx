import './WorkCardStyle.css'
import WorkCard from './WorkCard';
import WorkCardData from './WorkCardData';

function Work() {
  return (
    <div className='work-container white-text' style={{background: 'black'}}>
      <h1 className='project-heading'>บริการ</h1>
      <div className='project-container'>
        {WorkCardData.map((val, index) => {
            return (
            <WorkCard 
                key={index} 
                imgsrc={val.imgsrc} 
                title={val.title}
                text={val.text}
                view={val.view}
            />
            )
        })}
      </div>
    </div>
  )
}

export default Work
