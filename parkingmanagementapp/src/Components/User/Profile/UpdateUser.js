import React, { useContext, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../../../configs/APIs";
import cookies from "react-cookies";
import { MyDispatchContext } from "../../../configs/Context";

const UpdateProfile = () => {
  const location = useLocation();
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigate();
  const user = location.state?.user;
  const [image, setImage] = useState(user?.avatar);
  console.log(user);
  const [update, setUpdate] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdate((prevUpdate) => ({ ...prevUpdate, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (const key in update) {
      formData.append(key, update[key]);
    }
    try {
      let res = await authApi(cookies.load("access-token")).post(endpoints["updateUser"](user.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", res);
      alert("Cập nhật thành công");
      dispatch({
        type: "login",
        payload: res.data,
      });
      nav("/profile")
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data || "Đã xảy ra lỗi.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setUpdate((prevUpdate) => ({ ...prevUpdate, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "120px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="avatar-container">
          <div className="avatar">
            {image ? (
              <img src={image} alt="Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
            ) : (
              <i className="fas fa-user fa-3x"></i>
            )}
            <label htmlFor="file-upload" className="file-upload-label">
              <i className="fas fa-camera"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              name="avatar"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        {Object.keys(update).map((key) => (
          key !== "avatar" && (
            <div style={{ marginBottom: "20px" }} key={key}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
              </label>
              <input
                type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                name={key}
                value={update[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )
        ))}
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
