import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import './employeeTable.css'
import 'dayjs/locale/th';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function EmployeeTable() {

    const [show, setShow] = useState(false);
    const [add, setAdd] = useState();
    const handleShow = () => {
        setShow(!show);
        console.log('show', show);
    }

    const [employees, setEmployees] = useState([]);

    const reloadEmployeeData = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3456/getEmployees",{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
          console.log(response.data);
          setEmployees(
            response.data.map((employee, index) => ({
              id: index + 1,
              firstname: employee.first_name,
              lastname: employee.last_name,
              email: employee.email,
              phone: employee.phone,
              status: employee.status,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
        });
    }
  };

    useEffect(() => {
        reloadEmployeeData();
    }, []);


    const columns = [
        { field: 'id', headerName: 'ลำดับ', flex: 1 },
        
        { field: 'firstname', headerName: 'ชื่อ', flex: 2 },
        { field: 'lastname', headerName: 'นามสกุล', flex: 2 },
        { field: 'email', headerName: 'อีเมล', flex: 2,},
        { field: 'phone', headerName: 'เบอร์โทรศัพท์', flex: 2 },
        {
          field: 'status',
          headerName: 'สถานะ',
          flex: 1,
          valueGetter: (params) => {
              switch (params.row.status) {
                  case '0':
                      return 'ใช้งาน';
                  case '1':
                      return 'ไม่ได้ใช้งาน';
              }
          },
      },
    ];

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'status') {
            setSelectedRow((prevSelectedRow) => ({
                ...prevSelectedRow,
                status: value,
            }));
        }
    };

    const handleSubmit = () => {
    if (employees.length === 0 ) {
        alert('Please fill in all the required fields.');
        } else {
            const data = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.email,
                usertype: 2
            };

            console.log(data);
    
            axios
                .post('http://http://localhost:3456//register', data)
                .then((response) => {
                    console.log('Data inserted successfully:', response.data);
                    alert('Data inserted successfully');
                    setShow(!show); 
                    reloadEmployeeData(); 
                })
                .catch((error) => {
                    console.error('Error inserting data:', error);
                    alert('Error inserting data');
            });
        }
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setAdd(false); 
        handleShow();
    };

    
      
    return (
        <>
            <div className='row'>
                <div className="col">
                    <h1 className='mt-4'>รายการบัญชีพนักงาน</h1>
                </div>
                <div className="col">
                    <div className="button-container">
                        <Button onClick={()=>{handleShow(),setAdd(true)}} className='queue-btn queue-btn-light'>
                            เพิ่มบัญชีพนักงาน
                        </Button>
                    </div>
                </div>
            </div>
            <div className='data-container'>
                <DataGrid
                    className='data-gird'
                    rows={employees}
                    columns={columns}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
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
                        { add ? 'เพิ่มบัญชีพนักงาน' : 'ยกเลิกการใช้งานบัญชีพนักงาน' }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {add ? (
                        <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="กรุณาระบุชื่อพนักงาน"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleFormChange}
                            />
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="กรุณาระบุนามสกุลพนักงาน"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleFormChange}
                            />
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="กรุณาระบุอีเมลพนักงาน"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                            />
                            <strong>โปรดตรวจสอบข้อมูลก่อนกดยืนยัน</strong>
                        </Form.Group>
                    </Form>
                    ) : (
                        <Form>
                            <div className="row">
                                <div className="col">
                                    <Form.Label>ชื่อ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="repair_id"
                                        value={selectedRow ? selectedRow.firstname : ''}
                                        disabled
                                    />
                                </div>
                                <div className="col">
                                    <Form.Label>นามสกุล</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="full_employee_name"
                                        value={selectedRow? selectedRow.lastname : ''}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Form.Label>อีเมล</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="repair_id"
                                        value={selectedRow? selectedRow.email : ''}
                                        disabled
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className='btn-save' onClick={handleSubmit}>
                        ยืนยัน ยกเลิกการใช้งาน
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EmployeeTable
