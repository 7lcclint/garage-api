import { useEffect, useState } from 'react';
import './reportsPromotions.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/th';
import dayjs from 'dayjs';

function ReportsPromotions() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const columns = [
        { field: 'repair_date', headerName: 'วันที่ใช้', flex: 2 },
        { field: 'promotion_name', headerName: 'ชื่อโปรโมชั่น', flex: 2 },
        { field: 'full_employee_name', headerName: 'ชื่อลูกค้าที่ใช้', flex: 2 },
        { field: 'reduce_amount', headerName: 'จำนวนเงินที่ลด', flex: 2 }
    ];

    useEffect(() => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.format('YYYY-M-D')
            const formattedEndDate = endDate.format('YYYY-M-D')
            console.log('********************************')
            console.log('formattedStartDate',formattedStartDate)
            console.log('formattedEndDate',formattedEndDate)

            fetch(`http://localhost:3456/promotionReportsByStartEnd?start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
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

    return (
        <>
            <div className="col">
                <h1 className='mt-4'>รายงานโปรโมชั่น</h1>
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

export default ReportsPromotions;
