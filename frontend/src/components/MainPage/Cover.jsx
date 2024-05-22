import { Component } from 'react';
import './cover.css';
import PropTypes from 'prop-types';

class Cover extends Component {
  render() {
    return (
        <div className='cover white-text'>
        <div className='heading'>
            <h1>{this.props.heading}</h1>
            <p>{this.props.text}</p>
        </div>
        </div>
    )
  }
}

Cover.propTypes = {
    heading: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired, 
};

export default Cover
