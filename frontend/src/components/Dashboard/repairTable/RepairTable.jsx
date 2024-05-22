import { useEffect, useState } from 'react';
import './repairTable.css'
import 'dayjs/locale/th';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function RepairTable() {

    const [reserveAccepts, setReserveAccepts] = useState([]);
    const [reapares, setRepair] = useState([]);

    const reloadReservations = () => {
        const token = localStorage.getItem('token');
        if(token){
            axios.get('http://localhost:3456/reservationsByStatusAccept', {
              headers: {
                 'Authorization': `Bearer ${token}`
              }
            })
            .then((response) => {
                console.log('API Response:', response);
                console.log('reserve data:', response.data);
                setReserveAccepts(
                response.data.map((reserveAccept) => ({
                    reserve_id: reserveAccept.reserve_id,
                    firstname: reserveAccept.first_name,
                    lastname: reserveAccept.last_name,
                    vehicle_reg: reserveAccept.vehicle_reg,
                    reserve_date: reserveAccept.reserve_date,
                    status: reserveAccept.status,
                    detail: reserveAccept.detail,
                }))
                );
            })
            .catch((error) => {
                console.error('Error fetching promotiona:', error);
            });

            axios.get('http://localhost:3456/repairData', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            .then((response) => {
              console.log('repair data: ',response.data);
              setRepair(
                    response.data.map((repair, index) => ({
                        id: index + 1,
                        firstname: repair.first_name,
                        lastname: repair.last_name,
                        full_service: repair.full_service,
                        discount_service: repair.discount_service,
                        repair_date: repair.repair_date,
                        repair_detail: repair.repair_detail,
                        repair_status: repair.repair_status,
                        promotion_name: repair.promotion_name,
                        repair_id: repair.repair_id
                    }))
                );
            })
            .catch((error) => {
                console.error('Error fetching repair:', error);
            });
        }
    };

    useEffect(() => {
        reloadReservations();
    }, []);


    const columns = [
        { field: 'id', headerName: 'ลำดับ', flex: 1 },
        { field: 'firstname', headerName: 'ชื่อ', flex: 2 },
        { field: 'lastname', headerName: 'นามสกุล', flex: 2 },
        { field: 'repair_detail', headerName: 'รายการ', flex: 3 },
/*         { field: 'full_service', headerName: 'ราคาเต็ม', flex: 2,},
        { field: 'discount_service', headerName: 'ราคาหลังหักส่วนลด', flex: 2 },
 */        { field: 'repair_date', headerName: 'วันที่', flex: 2 },
/*         { field: 'promotion_name', headerName: 'โปรโมชั่นที่ใช้', flex: 2 },
 */        {
            field: 'repair_status',
            headerName: 'สถานะ',
            flex: 3,
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
          }
    ];

    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
        setAdd(false);
        console.log('show', show);
        console.log('add', add);
        console.log('reserveAccepts: ', reserveAccepts);
    }

    const [formData, setFormData] = useState({
        vehicle_reg: '',
        detail: '',
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'repair_status') {
            setSelectedRow((prevSelectedRow) => ({
                ...prevSelectedRow,
                repair_status: value,
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setFormData({
            ...formData,
            repair_status: params.row.repair_status,
        });
        handleShow();
    };

    const [add, setAdd] = useState();

    const [promotions, setPromotions] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:3456/getPromotions')
            .then((response) => {
              console.log(response.data);
              setPromotions(
                    response.data.map((promotion, index) => ({
                        id: index+1,
                        promotion_id: promotion.promotion_id,
                        promotion_name: promotion.promotion_name,
                        promotion_detail: promotion.promotion_detail,
                        promotion_code: promotion.promotion_code,
                        money: promotion.money,
                        percent: promotion.percent,
                        start_date: promotion.start_date,
                        end_date: promotion.end_date,
                        promotion_status: promotion.promotion_status
                    }))
                );
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error);
            });
    }, []);

    const handleSubmit = () => {
        if (!selectedRow || selectedRow.repair_status === "เลือกอัปเดทสถานะ") {
            alert('กรุณารุบะสถานะการซ่อมที่ต้องเปลี่ยนเปลี่ยน');
            return;
        }
        const data = {
            repair_status: selectedRow.repair_status,
            full_service: priceData.fullPrice,
            discount_service: priceData.fullPrice
        };
        data.repair_id = selectedRow.repair_id;

        console.log('data', data);
        console.log('data.repair_id', data.repair_id);
        const token = localStorage.getItem('token');
        if(token){
            axios
                .put(`http://localhost:3456/updateRepairData/${selectedRow.repair_id}`, data, {
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                })
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
        }
    };

    const [selectedOption, setSelectedOption] = useState(null);
    const [priceData, setPriceData] = useState({
        fullPrice: 0,
        discountPrice: 0
    });

    const handleSelectedPromotion = (e) => {
        const select = e.target.value
        console.log('Selected promotion', select);
        const selectedPromotion = promotions.find((item) => item.promotion_id === parseInt(select));
        console.log('selectedPromotion',selectedPromotion)
        
        if(selectedPromotion.money === 0){
            console.log('percent',selectedPromotion.percent)
            
            const discountPercent = selectedPromotion.percent;
            const fullPrice = parseFloat(priceData.fullPrice);
            const discountPrice = fullPrice - (fullPrice * discountPercent / 100);
            setPriceData({ ...priceData, discountPrice: discountPrice  });
        } else {
            const fullPrice = parseFloat(priceData.fullPrice);
            const discountPrice = fullPrice - selectedPromotion.money;
            setPriceData({ ...priceData, discountPrice: discountPrice });
            console.log('money',selectedPromotion.money)
        }
        console.log('fullPrice',priceData.fullPrice)
        console.log('discountPrice',priceData.discountPrice)
    }

    const handleOptionChange = (event) => {
        const selectedId = event.target.value;
        console.log('selectedId', selectedId)
        const selectedReserve = reserveAccepts.find((item) => item.reserve_id === parseInt(selectedId));
        setSelectedOption(selectedReserve);
        console.log('selectedReserve',selectedReserve)
        setFormData({
            ...formData,
            first_name: selectedReserve ? selectedReserve.firstname : '',
            last_name: selectedReserve ? selectedReserve.lastname : '',
            detail: selectedReserve ? selectedReserve.detail : '',
        });
    };

    return (
        <>
            <div className='row'>
                <div className="col">
                    <h1 className='mt-4'>รายการซ่อมทั้งหมด</h1>
                </div>
                <div className="col">
                <div className="button-container">
                    <Button onClick={()=>{handleShow(), setAdd(true)}} className='queue-btn queue-btn-light'>
                        เพิ่มรายการซ่อม
                    </Button>
            </div>
                </div>
            </div>
            <div className='data-container'>
                <DataGrid
                    className='data-gird'
                    disableRowSelectionOnClick
                    rows={reapares}
                    columns={columns}
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
                <Modal.Header closeButton  onClick={handleShow}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {add ? 'เพิ่มรายการซ่อม' : 'จัดการรายการซ่อม'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {add ? (
                        <Form>
                        <div className="row">
                        <Form.Label>รายการจองที่มีสถานะรับซ่อม</Form.Label>
                        <Form.Select 
                            aria-label="Default select example"
                            onChange={handleOptionChange}
                        >
                        {reserveAccepts.map((item) => (
                            <option key={item.reserve_id} value={item.reserve_id}>
                                ชื่อ : {item.firstname}  {item.lastname}{' '}
                                วันที่จอง : {item.reserve_date}{' '}
                                ทะเบียนรถ : {item.vehicle_reg}
                            </option>
                        ))}
                        </Form.Select>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>ชื่อลูกค้า</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    disabled
                                    value={selectedOption ? selectedOption.firstname : 'none'}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col">
                                <Form.Label>นามสกุลลูกค้า</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={selectedOption ? selectedOption.lastname : 'none'}
                                    disabled
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Label>รายการ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_service"
                                    disabled
                                    value={selectedOption ? selectedOption.detail : 'none'}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col">
                                <Form.Label>สถานะ</Form.Label>
                                <Form.Select 
                                    aria-label="Default select example"
                                    name="repair_status"
                                    value={selectedRow?.repair_status || ''}
                                    onChange={handleFormChange}
                                >
                                        <option>เลือกอัปเดทสถานะ</option>
                                        <option value="2">ตรวจสอบและประเมินความเสียหาย</option>
                                        <option value="3">อยู่ในระหว่างการดำเนินการซ่อม</option>
                                        <option value="4">ซ่อมเสร็จเรียบร้อย</option>
                                </Form.Select>
                            </div>
                        </div>
                        </Form>
                    ):(
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
                                    <Form.Label>ราคาเต็ม</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="full_service"
                                        value={priceData.fullPrice}
                                        disabled={selectedRow?.repair_status !== '4'}
                                        onChange={(e) => setPriceData({ ...priceData, fullPrice: e.target.value })}
                                    />
                                </div>
                                <div className="col">
                                    <Form.Label>ราคาหลังหักส่วนลด</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="discount_service"
                                        value={selectedRow?.discount_service || '-'}
                                        disabled
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Form.Label>โปรโมชั่นที่ใช้</Form.Label>
                                    <Form.Select 
                                    aria-label="Default select example"
                                    name="promotion_id"
                                    onChange={handleSelectedPromotion}
                                    disabled={selectedRow?.repair_status !== '4'}
                                    >
                                        {promotions.map((item) => (
                                            <option key={item.promotion_id} value={item.promotion_id}>
                                                {item.promotion_name+" "}
                                                ลด: {item.money} บาท
                                                ลด: {item.percent} เปอร์เซ็นต์
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Form.Label>รายการ</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        type="text"
                                        name="repair_detail"
                                        value={selectedRow?.repair_detail || ''}
                                        disabled
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="col">
                                    <Form.Label>สถานะ</Form.Label>
                                    <Form.Select 
                                        aria-label="Default select example"
                                        name="repair_status"
                                        value={selectedRow?.repair_status || ''}
                                        onChange={handleFormChange}
                                    >
                                            <option>เลือกอัปเดทสถานะ</option>
                                            <option value="0">ยกเลิก</option>
                                            <option value="3">อยู่ในระหว่างการดำเนินการซ่อม</option>
                                            <option value="4">ซ่อมเสร็จเรียบร้อย</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Form>
                    )}
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

export default RepairTable