import { useEffect, useState } from 'react';
import './reports.css';
import { DataGrid } from '@mui/x-data-grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/th';
import dayjs from 'dayjs';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Reports() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const columns = [
        { field: 'repair_id', headerName: 'รหัสการซ่อม', flex: 2 },
        { field: 'employee_id', headerName: 'รหัสพนักงาน', flex: 2 },
        { field: 'full_employee_name', headerName: 'ชื่อพนักงาน', flex: 2 },
        { field: 'full_customer_name', headerName: 'ชื่อลูกค้า', flex: 2 },
        { field: 'repair_detail', headerName: 'รายละเอียด', flex: 2 },
        { field: 'vehicle_reg', headerName: 'ทะเบียนรถ', flex: 2 },
        { field: 'full_service', headerName: 'ราคาบริการเต็ม', flex: 2 },
        { field: 'discount_service', headerName: 'ราคาบริการที่ติดส่วนลด', flex: 2 },
        { field: 'repair_status', headerName: 'สถานะการซ่อม', flex: 2,
        valueGetter: (params) => {
            switch (params.row.repair_status) {
              case '0':
                return 'ยกเลิก';
              case '1':
                return 'รับซ่อม';
              case '2':
                return 'ตรวจสอบและประเมินความเสียหาย';
              case '3':
                return 'อยู่ในระหว่างการดำเนินการซ่อม';
              case '4':
                return 'ซ่อมเสร็จเรียบร้อย';
              default:
                return 'ไม่ทราบสถานะ';
            }
          },
        },
        { field: 'promotion_id', headerName: 'รหัสโปรโมชั่น', flex: 2 },
        { field: 'repair_date', headerName: 'วันที่เข้าซ่อม', flex: 2 },
    ];

    useEffect(() => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.format('YYYY-M-D')
            const formattedEndDate = endDate.format('YYYY-M-D')
            console.log('********************************')
            console.log('formattedStartDate',formattedStartDate)
            console.log('formattedEndDate',formattedEndDate)

            fetch(`http://localhost:3456/fullReportsByStartEnd?start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
                .then(response => response.json())
                .then(data => {
                    const reportDataWithIds = data.map((row, index) => ({
                        ...row,
                        id: index,
                        repair_date: dayjs(row.repair_date).format('DD/MM/YYYY')
                    }));
                    setReportData(reportDataWithIds);
                })
                .catch(error => {
                    console.error('พบข้อผิดพลาดในการดึงข้อมูล: ' + error);
                });
        }
    }, [startDate, endDate]);

    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    }

    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        console.log(selectedRow);
        handleShow();
    };

    return (
        <>
            <div className="col">
                <h1 className='mt-4'>รายการซ่อมทั้งหมด</h1>
            </div>
            <div className='data-container'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="วันที่เริ่มต้น"
                            value={startDate}
                            onChange={date => setStartDate(date)}
                        />
                        <DatePicker
                            label="วันที่สิ้นสุด"
                            value={endDate}
                            minDate={startDate}
                            onChange={date => setEndDate(date)}
                        />
                    </DemoContainer>
                </LocalizationProvider><br />
                <DataGrid
                    className='data-gird'
                    disableRowSelectionOnClick
                    rows={reportData}
                    columns={columns}
                    onRowClick={handleRowClick}
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
                <Modal.Header closeButton  onClick={handleShow}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        รายละเอียด
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col">
                                <Form.Label>รหัสการซ่อม</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="repair_id"
                                    value={selectedRow ? selectedRow.repair_id : ''}
                                    disabled
                                />
                            </div>
                            <div className="col">
                                <Form.Label>สถานะ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_employee_name"
                                    value={selectedRow ? 
                                            selectedRow.repair_status === '0' ? 'ยกเลิก' : 
                                            selectedRow.repair_status === '1' ? 'รับซ่อม' :
                                            selectedRow.repair_status === '2' ? 'ตรวจสอบและประเมินความเสียหาย' :
                                            selectedRow.repair_status === '3' ? 'อยู่ในระหว่างการดำเนินการซ่อม' :
                                            selectedRow.repair_status === '4' ? 'ซ่อมเสร็จเรียบร้อย' : 'non status' : ''}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>ชื่อลูกค้า</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_customer_name"
                                    value={selectedRow ? selectedRow.full_customer_name : ''}
                                    disabled
                                />
                            </div>
                            <div className="col">
                                <Form.Label>ชื่อพนักงาน</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_employee_name"
                                    value={selectedRow ? selectedRow.full_employee_name : ''}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>ราคาเต็ม</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_service"
                                    value={selectedRow ? selectedRow.full_service : ''}
                                    disabled
                                />
                            </div>
                            <div className="col">
                                <Form.Label>ราคาหลังหักส่วนลด</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="discount_service"
                                    value={selectedRow ? selectedRow.discount_service : ''}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>ทะเบียนรถ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="vehicle_reg"
                                    value={selectedRow?.vehicle_reg || '-'}
                                    disabled
                                />
                            </div>
                            <div className="col">
                                <Form.Label>วันที่</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="repair_date"
                                    value={selectedRow?.repair_date || '-'}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>รายละเอียด</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    name="repair_detail"
                                    value={selectedRow?.repair_detail || '-'}
                                    disabled
                                />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Reports;
