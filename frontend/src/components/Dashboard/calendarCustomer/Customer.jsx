import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import './calendar.css'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/th';
import dayjs from 'dayjs';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import 'moment/locale/th';
dayjs.locale('th');

function Calendar() {

    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
        console.log('show', show);
    }

    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [newDateTimeInThaiBE, setNewDateTimeInThaiBE] = useState(null);
    const handleDateTimeChange = (newDateTime) => {
        setSelectedDateTime(newDateTime);
        const newDateTimeInThaiBE = newDateTime.add(543, 'year');
        setNewDateTimeInThaiBE(newDateTimeInThaiBE);
    }

    const [reservations, setReservations] = useState([]);

    /* useEffect(() => {
        // Fetch reservations from the server when the component mounts
        axios.get('http://localhost:3456/reservations') // Adjust the URL to match your server route
          .then((response) => {
            setReservations(response.data);
            setReservations(
                response.data.map((reservation, index) => ({
                  id: index + 1,
                  vehicle_reg: reservation.vehicle_reg,
                  reserve_date: reservation.reserve_date,
                  status: reservation.status,
                  detail: reservation.detail,
                  user_id: reservation.user_id,
                }))
              );
          })
          .catch((error) => {
            console.error('Error fetching reservations:', error);
          });
    }, []); */

    const reloadReservations = () => {
        axios
            .get('http://localhost:3456/reservations') // Adjust the URL to match your server route
            .then((response) => {
                setReservations(
                    response.data.map((reservation, index) => ({
                        id: index + 1,
                        vehicle_reg: reservation.vehicle_reg,
                        reserve_date: reservation.reserve_date,
                        status: reservation.status,
                        detail: reservation.detail,
                        user_id: reservation.user_id,
                    }))
                );
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error);
            });
    };

    useEffect(() => {
        // Fetch reservations from the server when the component mounts
        reloadReservations();
    }, []);


    const columns = [
        { field: 'id', headerName: 'ลำดับ', flex: 1 },
        { field: 'vehicle_reg', headerName: 'ทะเบียนรถ', flex: 2 },
        { field: 'reserve_date', headerName: 'วันที่', flex: 2 },
        {
            field: 'status',
            headerName: 'สถานะ',
            flex: 2,
            valueGetter: (params) => {
                switch (params.row.status) {
                    case '0':
                        return 'ยกเลิก';
                    case '1':
                        return 'จองซ่อม';
                    case '2':
                        return 'รับซ่อม';
                }
            },
        },
        { field: 'detail', headerName: 'รายละเอียด', flex: 2 },
    ];

    const [formData, setFormData] = useState({
        vehicle_reg: '',
        detail: '',
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        if (reservations.length === 0 || !formData.vehicle_reg || !selectedDateTime) {
            alert('Please fill in all the required fields.');
        } else {
            const data = {
                user_id: reservations[0].user_id,
                vehicle_reg: formData.vehicle_reg,
                reserve_date: selectedDateTime.format('YYYY-MM-DD'),
                detail: formData.detail,
            };
    
            // Send the data to the server via an API call
            axios
                .post('http://localhost:3456/bookqueue', data)
                .then((response) => {
                    console.log('Data inserted successfully:', response.data);
                    alert('Data inserted successfully');
                    setShow(!show); // Close the modal
                    reloadReservations(); // Reload the reservations data
                })
                .catch((error) => {
                    console.error('Error inserting data:', error);
                    alert('Error inserting data');
                });
        }
    };
      
    return (
        <>
            <div className="button-container">
                <Button onClick={handleShow} className='queue-btn queue-btn-light'>
                    จองคิวเข้าซ่อม
                </Button>
            </div>
            <div className='data-container'>
                <DataGrid
                    className='data-gird'
                    rows={reservations}
                    columns={columns}
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
                        จองคิวเข้าใช้บริการ
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>ทะเบียนรถ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="กรุณาระบเลขทะเบียนรถ"
                                name="vehicle_reg"
                                value={formData.vehicle_reg}
                                onChange={handleFormChange}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='th'>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DemoItem
                                        label={'วันที่เข้าใช้บริการ: ' + (selectedDateTime ? newDateTimeInThaiBE.format('dddd, D MMMM YYYY') : 'None')}>
                                        <DateTimePicker
                                            minDate={dayjs().add(1, 'day')}
                                            required
                                            views={['year', 'day']}
                                            value={selectedDateTime}
                                            onChange={handleDateTimeChange}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                            <Form.Label>รายละเอียด</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                placeholder="กรุณาระบเลขทะเบียนรถ"
                                name="detail"
                                value={formData.detail}
                                onChange={handleFormChange}
                            />
                            <strong>โปรดตรวจสอบข้อมูลก่อนกดยืนยัน</strong>
                        </Form.Group>
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

export default Calendar
