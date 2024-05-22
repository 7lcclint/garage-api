import { useEffect, useState } from 'react';
import './reportsRevenue.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Form from 'react-bootstrap/Form';
import 'dayjs/locale/th';
import dayjs from 'dayjs';

function ReportsRevenue() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [rangeOrMonth, setRangeOrMonth] = useState(true);
    const [uniqueYears, setUniqueYears] = useState([]);

    const columns = [
        { field: 'repair_date', headerName: 'วันที่', flex: 2 },
        { field: 'revenue', headerName: 'รายรับ', flex: 2 }
    ];

    useEffect(() => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.format('YYYY-M-D');
            const formattedEndDate = endDate.format('YYYY-M-D');
            console.log('********************************')
            console.log('formattedStartDate', formattedStartDate)
            console.log('formattedEndDate', formattedEndDate)
    
            fetch(`http://localhost:3456/reportRevenueByStartEnd?start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
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
        } else {
            fetch('http://localhost:3456/reportRevenueAll')
                .then(response => response.json())
                .then(data => {
                    const reportDataWithIds = data.map((row, index) => ({
                        ...row,
                        id: index,
                        repair_date: dayjs(row.repair_date).format('DD/MM/YYYY'),
                        year: dayjs(row.repair_date).format('YYYY')
                    }));
                    setReportData(reportDataWithIds);
                    const uniqeY = [...new Set(reportDataWithIds.map(item => item.year))];
                    setUniqueYears(uniqeY)
                })
                .catch(error => {
                    console.error('พบข้อผิดพลาดในการดึงข้อมูล: ' + error);
                });
        }
    }, [startDate, endDate]);

    function getThaiMonth(monthNumber) {
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม',
            'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน',
            'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
    
        return thaiMonths[monthNumber - 1];
    }
    const selectY = (e) => {
        const year = e.target.value;
        console.log('select', year)
        fetch(`http://localhost:3456/reportRevenueByMonth/${parseInt(year)}`)
            .then((response) => response.json())
            .then((data) => {
                setReportData(data.map((row, index) => ({
                    ...row,
                    id: index,
                    repair_date: row.month,
                    revenue: row.revenue
                })));
                console.log(data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }

    return (
        <>
            <div className='row'>
                <div className="col">
                    <h1 className='mt-4'>รายงานรายรับ</h1>
                </div>
                <div className="col">
                    <div className="button-container">
                        <button  
                            style={{ minWidth: '200px', maxWidth: '200px', textAlign: 'center' }}
                            className='queue-btn queue-btn-light'
                            onClick={()=>{setRangeOrMonth(!rangeOrMonth)}}
                        >
                            {rangeOrMonth ? 'เลือกช่วงเวลา' : 'เลือกปี'}
                        </button>
                    </div>
                </div>
            </div>
            <div className='data-container'>
                {rangeOrMonth ? (
                    <div>
                        <Form.Select 
                        style={{maxWidth: '200px'}}
                        aria-label="Default select example"
                        onChange={year =>{selectY(year)}}
                        >
                            <option>เลือกปี</option>
                            {uniqueYears.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                        </Form.Select><br/>
                    </div>
                ) : (
                    <div>
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
                    </div>
                )}
                <DataGrid
                    className='data-gird'
                    disableRowSelectionOnClick
                    rows={ !rangeOrMonth ? 
                        reportData 
                        : 
                        reportData.map(row => ({
                        ...row,
                        repair_date: getThaiMonth(new Date(row.repair_date).getMonth() + 1), // +1 because months are 0-based
                    }))}
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

export default ReportsRevenue;
