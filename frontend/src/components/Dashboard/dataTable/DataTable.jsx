import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const DataTable = (props) => {
  const handleDelete = (id) => {
    console.log(`Delete ${id}`);
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`../${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
              },
        }}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        components={{
          Toolbar: GridToolbar,
        }}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
};

DataTable.propTypes = {
  slug: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

export default DataTable;
