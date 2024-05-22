import { useState } from "react";
import "./settingAccount.css";
import { useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import noavatar from "../../../../public/noavatar.png";

const SettingAccount = () => {
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token from setting : ", token != null);
    if (token) {
      axios
        .get("http://localhost:3456/getUserDataByEmail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.Status === "Successfully") {
            setUserData({
              user_id: response.data.user_id,
              firstName: response.data.firstname,
              lastName: response.data.lastname,
              phone: response.data.phone,
              email: response.data.email,
              street: response.data.address_street,
              province: response.data.address_province,
              district: response.data.address_district,
              subdistrict: response.data.address_subdistrict,
              zipcode: response.data.address_zipcode,
              profile_picture: response.data.profile_picture,
            });
          } else {
            console.log(response.data.Error);
          }
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const [enable, setEnable] = useState(true);
  const handleEdit = () => {
    setEnable(!enable);
    setEdit(false);
  };

  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .put("http://localhost:3456/update-user-data", userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data && response.data.message) {
            console.log("User data updated successfully");
            alert("User data updated");
            setEnable(!enable);
          } else {
            console.error("Error updating user data:", response.data);
          }
        })
        .catch((error) => {
          setEnable(!enable);
          console.error("Error updating user data:", error);
        });

      if (profilePicture) {
        const formData = new FormData();
        formData.append("image", profilePicture);

        axios
          .put(
            `http://localhost:3456/update-profile-picture/${userData.user_id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data && response.data.message) {
              console.log("Image uploaded successfully");
              alert("Image uploaded successfully");
              window.location.reload();
            } else {
              console.error("Error uploading image:", response.data);
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      } else {
        console.error("No image selected");
      }
    }
  };

  const handleEditPassword = () => {
    const token = localStorage.getItem("token");
    setEdit(!edit);
    console.log("Edit password", edit);
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    const passwordUpdateData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };
  
    axios
      .put(
        `http://localhost:3456/change-password/${userData.user_id}`,
        passwordUpdateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          console.log("Edit Password successfully");
          alert("Password was updated");
          setEnable(!enable);
        } else {
          console.error("Error updating user data:", response.data);
        }
      })
      .catch((error) => {
        setEnable(!enable);
        console.error("Error updating user data:", error);
      });
  };  

  return (
    <>
      Setting Account
      <div className="profile">
        <div className="view">
          <div className="info">
            <div className="topInfo">
              <img
                src={
                  userData.profile_picture
                    ? `/src/assets/profilePicture/${userData.profile_picture}`
                    : noavatar
                }
                alt="Profile"
              />
              {!enable && !edit ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              ) : (
                ""
              )}
              <button
                onClick={handleEditPassword}
                className={"edit-button-grey"}
              >
                {!edit ? "เปลี่ยนรหัสผ่าน" : "บันทึกรหัสผ่าน"}
              </button>
              <button
                onClick={enable ? handleEdit : handleSave}
                className={enable ? "edit-button-red" : "edit-button-blue"}
              >
                {enable ? "แก้ไขข้อมูล" : "บันทึกข้อมูล"}
              </button>
            </div>
            <div className="details">
              {edit ? (
                <Form>
                  <Row>
                    <Col>
                      <div>กรุณาใส่รหัสผ่านเดิม</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={passwordData.currentPassword || ""}
                        placeholder={"old password"}
                        disabled={!edit}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>รหัสผ่านใหม่</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={passwordData.newPassword || ""}
                        placeholder={"new password"}
                        disabled={!edit}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col>
                      <div>ยืนยันรหัสผ่าน</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={passwordData.confirmPassword || ""}
                        placeholder={"confirm new password"}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        disabled={!edit}
                      />
                    </Col>
                  </Row>
                </Form>
              ) : (
                <Form>
                  <Row>
                    <Col>
                      <div>ชื่อ</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.firstName || ""}
                        placeholder={userData.firstName}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col>
                      <div>นามสกุล</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.lastName || ""}
                        placeholder={userData.lastName}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({ ...userData, lastName: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>เบอร์โทรศัพท์</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.phone || ""}
                        placeholder={userData.phone}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <div>อีเมล</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.email || ""}
                        placeholder={userData.email}
                        disabled
                      />
                    </Col>
                  </Row>
                  <div style={{ margin: "10px 0" }}>
                    <h2>ที่อยู่</h2>
                  </div>
                  <Row>
                    <Col>
                      <div>ตำบล</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.subdistrict || ""}
                        placeholder={userData.subdistrict}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            subdistrict: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col>
                      <div>อำเภอ</div>
                      <Form.Control
                        value={userData.district || ""}
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        placeholder={userData.district}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({ ...userData, district: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>จังหวัด</div>
                      <Form.Control
                        value={userData.province || ""}
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        placeholder={userData.province}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({ ...userData, province: e.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <div>รหัสไปรษณีย์</div>
                      <Form.Control
                        style={{ backgroundColor: "#2a3447", color: "white" }}
                        value={userData.zipcode || ""}
                        placeholder={userData.zipcode}
                        disabled={enable}
                        onChange={(e) =>
                          setUserData({ ...userData, zipcode: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row style={{ height: "3rem" }}>
                    <Col>
                      <div>รายละเอียดที่อยู่</div>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Control
                          as="textarea"
                          rows={3}
                          style={{ backgroundColor: "#2a3447", color: "white" }}
                          value={userData.street || ""}
                          placeholder={userData.street}
                          disabled={enable}
                          onChange={(e) =>
                            setUserData({ ...userData, street: e.target.value })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </div>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default SettingAccount;
