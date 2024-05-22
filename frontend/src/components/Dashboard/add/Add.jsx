import "./add.css";
import PropTypes from 'prop-types';

const Add = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.setOpen(false)
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}> {/* Unique key prop */}
                <label>{column.headerName}</label>
                <input type={column.type} placeholder={column.field} />
              </div>
            ))}
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

Add.propTypes = {
  slug: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Add;