import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import "../../../Assest/Otp.css";
import { authApi, endpoints } from "../../../configs/APIs";
import { useLocation, useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import TimerDisplay from "./AutoCounter";
import ConfirmDialog from "./ConfirmModal";

const OtpInput = ({ length, timeLeft, setTimeLeft }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [newOtp, setNewOtp] = useState("");
  const location = useLocation();
  const nav = useNavigate();
  // const timeLeft = useRef(180); // 3 phút = 180 giây
  const email = location.state?.email;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };


  const handleConfirm = () => {
    sessionStorage.setItem("otp", CreateNewOtp());
    setIsDialogOpen(false);
    console.log("Confirmed!");
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    console.log("Cancelled!");
  };
  function generateRandomOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  const handleSendMail = async (otp, email) => {
    try {
      console.log("dawdawdawdaw");
      console.log(otp);

      authApi(cookies.load("access-token")).post(endpoints["email"], {
        to: email,
        subject: "Ma OTP",
        message: otp,
      });
    } catch (ex) {
      console.error(ex);
    }
  };

  const CreateNewOtp = async () => {
    setNewOtp(generateRandomOtp());
  };
  const SendNewOtp = async () => {
    await CreateNewOtp();
    setTimeLeft(30);
  };

  if (timeLeft === 0) {
    sessionStorage.removeItem("otp");
  }
  useEffect(() => {
    console.log("dawdaiwdjiaw");
    console.log(sessionStorage.getItem("otp"));

    if (sessionStorage.getItem("otp")) {
      console.log("AAAAAAAAAAAAA");
      handleOpenDialog()
    } else {
        CreateNewOtp();
    }

    // Cleanup sự kiện khi component unmount
  }, []);

  useEffect(() => {
    if (newOtp !== "") {
      handleSendMail(newOtp, email);
      sessionStorage.setItem("otp", newOtp);
    }
  }, [newOtp]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus vào ô nhập liệu tiếp theo
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem("otp")) {
      alert("Hết time hiệu lực của mã, vui lòng chọn gửi và nhập lại mã");
      return;
    }
    if (otp.join("") == sessionStorage.getItem("otp")) {
      sessionStorage.removeItem("otp");
      nav("/Home");
    } else {
      if (otp.join("") == "") {
        alert("Vui lòng nhập mã OTP!");
        return;
      }
      alert("Mã OTP không đúng!");
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        message="Tải lại trang sẽ gửi lại otp, bạn vẫn muốn tải lại"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <form onSubmit={handleSubmit} className="otp-form">
        <h3>Nhập mã OTP</h3>
        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="otp-input"
            />
          ))}
        </div>
        <div>
          <button type="submit" className="otp-submit">
            Xác nhận
          </button>
          <button type="button" className="btn-danger" onClick={SendNewOtp}>
            Gửi lại
          </button>
        </div>
      </form>
    </>
  );
};

export default memo(OtpInput);
