import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import "./promotions.css";
import "dayjs/locale/th";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Promotions() {
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
    console.log("show", show);
  };

  const [promotions, setPromotions] = useState([]);
  const reloadReservations = () => {
    if (token) {
      axios
        .get("http://localhost:3456/getPromotions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setPromotions(
            response.data.map((promotion, index) => ({
              id: index + 1,
              promotion_id: promotion.promotion_id,
              promotion_name: promotion.promotion_name,
              promotion_detail: promotion.promotion_detail,
              promotion_code: promotion.promotion_code,
              money: promotion.money,
              percent: promotion.percent,
              start_date: promotion.start_date,
              end_date: promotion.end_date,
              promotion_status: promotion.promotion_status,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
        });
    }
  };

  const [userType, setUserType] = useState();
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3456/getUserDataByEmail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.Status === "Successfully") {
            setUserType(response.data.user_type);
            console.log(userType);
            console.log("Type :", response.data.user_type);
          } else {
            console.log(response.data.Error);
          }
        })
        .then((error) => console.log(error));
      reloadReservations();
    }
  }, []);

  const columns = [
    { field: "id", headerName: "ลำดับ", flex: 1 },
    { field: "promotion_name", headerName: "ชื่อโปรโมชั่น", flex: 2 },
    { field: "promotion_code", headerName: "รหัสโปรโมชั่น", flex: 2 },
    { field: "start_date", headerName: "วันที่เริ่มใช้", flex: 2 },
    { field: "end_date", headerName: "วันที่สิ้นสุด", flex: 2 },
    {
      field: "promotion_status",
      headerName: "สถานะ",
      flex: 2,
      valueGetter: (params) => {
        switch (params.row.promotion_status) {
          case "0":
            return "ยกเลิก";
          case "1":
            return "ใช้งาน";
        }
      },
    },
    { field: "promotion_detail", headerName: "รายละเอียด", flex: 4 },
  ];

  const [formData, setFormData] = useState({
    percent: "",
    money: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "percent") {
      const percentValue = parseFloat(value);
      if (!isNaN(percentValue) && percentValue >= 0 && percentValue <= 100) {
        setFormData({
          ...formData,
          percent: percentValue,
          money: "0.00",
        });
      }
    } else if (name === "money") {
      const moneyValue = parseFloat(value);
      if (!isNaN(moneyValue)) {
        setFormData({
          ...formData,
          percent: "0.00",
          money: moneyValue,
        });
      }
    } else if (name === "promotion_code") {
      setFormData({
        ...formData,
        promotion_code: value,
      });
    } else if (name === "promotion_name") {
      setFormData({
        ...formData,
        promotion_name: value,
      });
    } else if (name === "promotion_status") {
      setFormData({
        ...formData,
        promotion_status: value,
      });
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (add) {
      if (
        !formData.promotion_name ||
        !formData.promotion_code ||
        (!formData.percent && !formData.money) ||
        !start ||
        !end
      ) {
        alert("Please fill in all the required fields.");
      } else {
        const data = {
          promotion_name: formData.promotion_name,
          promotion_detail: formData.promotion_detail,
          promotion_code: formData.promotion_code,
          money: formData.money,
          percent: formData.percent,
          start_date: start,
          end_date: end,
        };
        axios
          .post("http://localhost:3456/insertPromotion", data)
          .then((response) => {
            console.log("Data inserted successfully:", response.data);
            alert("Data inserted successfully");
            setShow(!show);
            reloadReservations();
          })
          .catch((error) => {
            console.error("Error inserting data:", error);
            alert("Error inserting data");
          });
      }
    } else {
      // If you are editing an existing promotion
      if (
        !formData.promotion_name ||
        !formData.promotion_code ||
        (!formData.percent && !formData.money) ||
        !start ||
        !end
      ) {
        alert("Please fill in all the required fields.");
      } else {
        const data = {
          promotionId: selectedRow.promotion_id,
          promotion_status: formData.promotion_status,
        };

        console.log(data);
        axios
          .put(`http://localhost:3456/update-promotion/${data.promotionId}`, {
            promotionStatus: data.promotion_status,
          })
          .then((response) => {
            console.log("Data updated successfully:", response.data);
            alert("Data updated successfully");
            setShow(!show);
            reloadReservations();
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            alert("Error updating data");
          });
      }
    }
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log("date", date);
    setStart(date.format("YYYY M D").replace(/ /g, "-"));
    console.log("start", start);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEnd(date.format("YYYY M D").replace(/ /g, "-"));
    console.log("end", end);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (params) => {
    setAdd(false);
    setSelectedRow(params.row);
    handleShow();
    console.log("row clicked", params.row);
  };

  const [add, setAdd] = useState();

  return (
    <>
      {userType === 1 ? (
        <div>
          <div className="row">
            <div className="col">
              <h1 className="mt-4">รายการโปรโมชั่น</h1>
            </div>
          </div>
          <div className="data-container">
            <DataGrid
              className="data-gird"
              rows={promotions}
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
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="row">
            <div className="col">
              <h1 className="mt-4">รายการโปรโมชั่น</h1>
            </div>
            <div className="col">
              <div className="button-container">
                <Button
                  onClick={() => {
                    handleShow(), setAdd(true);
                  }}
                  className="queue-btn queue-btn-light"
                >
                  เพิ่มโปรโมชั่น
                </Button>
              </div>
            </div>
          </div>
          <div className="data-container">
            <DataGrid
              className="data-gird"
              rows={promotions}
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
                {add ? "เพิ่มโปรโมชั่น" : "จัดการโปรโมชั่น"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {add ? (
                <Form>
                  <div className="row">
                    <div className="col">
                      <Form.Label>ชื่อโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาระบุชื่อโปรโมชั่น"
                        name="promotion_name"
                        value={formData.promotion_name}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>รหัสโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาระบุรหัสโปรโมชั่น"
                        name="promotion_code"
                        value={formData.promotion_code}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Label>ส่วนลดเปอร์เซ็นต์</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="กรุณาระบุส่วนลดเปอร์เซ็นต์"
                        name="percent"
                        value={formData.percent}
                        onChange={handleFormChange}
                        min={1}
                        max={100}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>ส่วนลดจำนวนเงิน</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="กรุณาระบุส่วนลดจำนวนเงิน"
                        name="money"
                        value={formData.money}
                        onChange={handleFormChange}
                      />
                    </div>
                    <strong>เลือกระหว่างส่วนลดเปอร์เซ็นต์หรือจำนวนเงิน</strong>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Label>รายละเอียดโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        as="textarea"
                        placeholder="กรุณาระบุรายละเอียดโปรโมชั่น"
                        name="promotion_detail"
                        value={formData.promotion_detail}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="th"
                    >
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          minDate={dayjs()}
                          label="วันที่เริ่มใช้"
                          value={startDate}
                          onChange={handleStartDateChange}
                          onClick={handleStartDateChange}
                          format="YYYY-M-D"
                        />
                        <DatePicker
                          minDate={startDate}
                          value={endDate}
                          onChange={handleEndDateChange}
                          onClick={handleEndDateChange}
                          label="วันที่สิ้นสุด"
                          format="YYYY-M-D"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <strong>โปรดตรวจสอบข้อมูลก่อนกดยืนยัน</strong>
                </Form>
              ) : (
                <Form>
                  <div className="row">
                    <div className="col">
                      <Form.Label>ชื่อโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาระบุชื่อโปรโมชั่น"
                        name="promotion_name"
                        disabled
                        value={selectedRow?.promotion_name || ""}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>รหัสโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาระบุรหัสโปรโมชั่น"
                        name="promotion_code"
                        disabled
                        value={selectedRow?.promotion_code || ""}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Label>ส่วนลดเปอร์เซ็นต์</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="กรุณาระบุส่วนลดเปอร์เซ็นต์"
                        name="percent"
                        disabled
                        value={selectedRow?.percent || ""}
                        min={1}
                        max={100}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>ส่วนลดจำนวนเงิน</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="กรุณาระบุส่วนลดจำนวนเงิน"
                        name="money"
                        disabled
                        value={selectedRow?.money || ""}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Label>รายละเอียดโปรโมชั่น</Form.Label>
                      <Form.Control
                        type="text"
                        as="textarea"
                        disabled
                        placeholder="กรุณาระบุรายละเอียดโปรโมชั่น"
                        name="promotion_detail"
                        value={selectedRow?.promotion_detail || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="th"
                    >
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label={selectedRow?.start_date || ""}
                          disabled
                        />
                        <DatePicker
                          label={selectedRow?.end_date || ""}
                          disabled
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Label>
                        สถานะปัจจุบัน
                        {selectedRow?.promotion_status === "1"
                          ? " : ใช้งาน"
                          : selectedRow?.promotion_status === "0"
                          ? " : ยกเลิก"
                          : ""}
                      </Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        name="promotion_status"
                        value={formData.promotion_status}
                        onChange={handleFormChange}
                      >
                        <option>เลือกอัปเดทสถานะ</option>
                        <option value="0">ยกเลิก</option>
                        <option value="1">ใช้งาน</option>
                      </Form.Select>
                    </div>
                  </div>
                  <strong>โปรดตรวจสอบข้อมูลก่อนกดยืนยัน</strong>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="btn-save" onClick={handleSubmit}>
                บันทึกข้อมูล
              </div>
              <div className="btn-cancel" onClick={handleShow}>
                ยกเลิก
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Promotions;
