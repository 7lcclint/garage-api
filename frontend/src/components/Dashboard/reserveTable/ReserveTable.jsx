import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import './reserveTable.css'
import 'dayjs/locale/th';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function ReserveTable() {

    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
        console.log('show', show);
    }

    const [reserves, setReserves] = useState([]);

    const reloadReservations = () => {
        const token = localStorage.getItem('token');
        if(token){
            axios.get('http://localhost:3456/allReservations', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
              console.log('reserve data: ',response.data);
              setReserves(
                    response.data.map((reserve, index) => ({
                        id: index + 1,
                        firstname: reserve.first_name,
                        lastname: reserve.last_name,
                        vehicle_reg: reserve.vehicle_reg,
                        reserve_date: reserve.reserve_date,
                        detail: reserve.detail,
                        status: reserve.status,
                        reserve_id: reserve.reserve_id
                    }))
                );
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error);
            });
        }
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setSelectedRow((prevSelectedRow) => ({
                ...prevSelectedRow,
                status: value,
            }));
        }
    };

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        handleShow();
    };

    useEffect(() => {
        reloadReservations();
    }, []);


    const columns = [
        { field: 'id', headerName: 'ลำดับ', flex: 1 },
        { field: 'firstname', headerName: 'ชื่อ', flex: 2 },
        { field: 'lastname', headerName: 'นามสกุล', flex: 2 },
        { field: 'vehicle_reg', headerName: 'ทะเบียนรถ', flex: 2,},
        { field: 'reserve_date', headerName: 'วันที่', flex: 2 },
        { field: 'status', headerName: 'สถานะ', flex: 2,
        valueGetter: (params) => {
            switch (params.row.status) {
              case '0':
                return 'ยกเลิก';
              case '1':
                return 'จองซ่อม';
              case '2':
                return 'รับซ่อม';
              default:
                return 'ไม่ทราบสถานะ';
            }
          }, },
        { field: 'detail', headerName: 'รายละเอียด', flex: 4 ,},
    ];

    const handleSubmit = () => {
        if (!selectedRow || selectedRow.status === "เลือกอัปเดทสถานะ") {
            alert('กรุณารุบะสถานะการซ่อมที่ต้องเปลี่ยนเปลี่ยน');
            return;
        }
        const data = {
            status: selectedRow.status,
            reserve_id: selectedRow.reserve_id
        };

        console.log('selected', selectedRow)
        console.log('data', data);
        console.log('data.reserve_id', selectedRow.reserve_id);
        axios
            .put(`http://localhost:3456/updateReserveData/${selectedRow.reserve_id}`, data)
            .then((response) => {
                console.log('Data updated successfully:', response.data);
                alert('Data updated successfully');
                setShow(!show);
                reloadReservations();
                setSelectedRow(null);
            })
            .catch((error) => {
                console.error('Error updating data:', error);
                alert('Error updating data');
        });
    };
      
    return (
        <>
            <h1>รายการจองซ่อมทั้งหมด</h1>
            <div className='data-container'>
                <DataGrid
                    className='data-gird'
                    rows={reserves}
                    columns={columns}
                    onRowClick={handleRowClick}
                    disableRowSelectionOnClick
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
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
            <Modal
                show={show}
                animation={true}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={handleShow}>
                    <Modal.Title id="contained-modal-title-vcenter">
                    อัปเดทสถานะการจองซ่อม
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <div className="row">
                        <div className="col">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={selectedRow?.firstname || ''}
                                disabled
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="col">
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={selectedRow?.lastname || ''}
                                disabled
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Form.Label>ทะเบียนรถ</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={selectedRow?.vehicle_reg || ''}
                                disabled
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="col">
                            <Form.Label>วันที่</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={selectedRow?.reserve_date || ''}
                                disabled
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                    <div className="col">
                            <Form.Label>รายละเอียด</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                as='textarea'
                                value={selectedRow?.detail || ''}
                                disabled
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="col">
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Select 
                                aria-label="Default select example"
                                name="status"
                                value={selectedRow?.status || ''}
                                onChange={handleFormChange}
                            >
                                    <option>เลือกอัปเดทสถานะ</option>
                                    <option value="0">ยกเลิก</option>
                                    <option value="1">จองซ่อม</option>
                                    <option value="2">รับซ่อม</option>
                            </Form.Select>
                        </div>
                    </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className='btn-save' onClick={handleSubmit}>
                        บันทึกข้อมูล
                    </div>
                    <div className='btn-cancel' onClick={handleShow}>
                        ยกเลิก
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReserveTable
