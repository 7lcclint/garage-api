import './WorkCardStyle.css'
import PropTypes from 'prop-types';

const WorkCard = (props) => {
  return (
    <div className='project-card white-text'>
        <img src={props.imgsrc} alt="image" />
        <h2 className='project-title'>{props.title}</h2>
        <div className='pro-details'>
            <p>{props.text}</p>
        </div>
    </div>
  )
}

WorkCard.propTypes = {
    imgsrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default WorkCard
