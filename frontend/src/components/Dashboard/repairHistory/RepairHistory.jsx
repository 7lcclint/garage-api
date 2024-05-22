import { useEffect, useState } from 'react';
import './repairHistory.css'
import 'dayjs/locale/th';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function RepairHistory() {

    const [repairs, setRepairs] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            axios.get('http://localhost:3456/getUserDataByEmail', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
            .then(response => {
                if (response.data.Status === "Successfully") {
                    const user_id = response.data.user_id;
                    axios.get(`http://localhost:3456/repairData/${user_id}`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      })
                    .then((response) => {
                        console.log('repair data: ', response.data);
                        setRepairs(
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
                } else {
                    console.log(response.data.Error)
                }
            })
            .catch(error => console.log(error));
        }
    }, []);

    const columns = [
        { field: 'id', headerName: 'ลำดับ', flex: 1 },
        { field: 'firstname', headerName: 'ชื่อ', flex: 2 },
        { field: 'lastname', headerName: 'นามสกุล', flex: 2 },
        { field: 'repair_detail', headerName: 'รายการ', flex: 3 },
        { field: 'repair_date', headerName: 'วันที่', flex: 2 },
        {
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
    return (
        <>
            <div className="col">
                <h1 className='mt-4'>รายการซ่อมทั้งหมด</h1>
            </div>
            <div className='data-container'>
                <DataGrid
                    className='data-gird'
                    disableRowSelectionOnClick
                    rows={repairs}
                    columns={columns}
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
        </>
    )
}

export default RepairHistory
