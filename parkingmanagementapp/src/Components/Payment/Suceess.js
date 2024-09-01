import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import "./SuceesPage.css"; // Import CSS file for styling
import PaymentSuccessPage from "./PaySuccess";
import PDFLink from "../Tiket/ExportPDF";
import cookies from "react-cookies";
import { authApi, endpoints } from "../../configs/APIs";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const choDoDetail = JSON.parse(localStorage.getItem("choDoDetail"));

  const generateRandomString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randomString = _.times(5, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    return randomString;
  };
  const getIdSale = async (paymentId, payerId) => {
    try {
      const formData = new FormData();
      formData.append("paymentId", paymentId);
      formData.append("PayerID", payerId);
      const url = endpoints["paypalSuccess"];
      let res = await authApi(cookies.load("access-token")).post(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Payment success response:", res.data);
      await saveTTDK(res.data);
    } catch (e) {
      alert("Đã hoàn thành quá trình thanh toán. Vui lòng quay lại trang chủ.");
      return;
    }
  };

  const saveInvoiceAndSendEmail = async () => {
    try {
      // Thay đổi endpoint thành /send-email
      const accessToken = cookies.load("access-token");
      const response = await authApi(accessToken).post(endpoints.sendMail, {
        to: "tuanchaunguyen13@gmail.com", // Email người nhận
        subject: "Invoice and Tour Information", // Tiêu đề email
        message: `Đây là thông tin thanh toán đặt chỗ thành công:
                Bãi xe:  ${choDoDetail.tenBai}
                Chỗ đặt: ${choDoDetail.tenKhu + choDoDetail.vitri}
                Thoi gian bat dau:${choDoDetail.Vo}
                Thoi Gian Ket Thuc: ${choDoDetail.Ra}`,
      });

      if (response.status !== 200) {
        // Check the HTTP status code
        throw new Error("Failed to save invoice and send email");
      }

      // Xử lý thành công, có thể chuyển hướng hoặc hiển thị thông báo
      console.log("Invoice saved and email sent successfully.");
    } catch (error) {
      console.error("Error saving invoice and sending email:", error);
    }
  };

  const saveTTDK = async (transid) => {
    try {
      // Lấy thông tin từ localStorage
      const choDoDetailString = localStorage.getItem("choDoDetail");
      const choDoDetail = choDoDetailString
        ? JSON.parse(choDoDetailString)
        : {};
      console.log(parseFloat(choDoDetail.gia).toFixed(1));
      // Tạo đối tượng dữ liệu gửi lên backend
      const accessToken = cookies.load("access-token");
      console.log({
        xeId: choDoDetail.idXe,
        thoiGianVoBai: new Date(choDoDetail.Vo).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
        thoiGianRaBai: new Date(choDoDetail.Ra).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
        choDoId: choDoDetail.id_cho,
        soTien: parseFloat(choDoDetail.gia),
        uid: transid,
        isHuy: 0, // giá trị mặc định
      });
      const response = await authApi(accessToken).post(
        endpoints["saveThongTinDangKy"],
        {
            xeId: choDoDetail.idXe,
            thoiGianVoBai: new Date(choDoDetail.Vo).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
            thoiGianRaBai: new Date(choDoDetail.Ra).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
            choDoId: choDoDetail.id_cho,
            soTien: choDoDetail.gia,
            uid: transid,
            isHuy: false, 
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to save registration details");
      }

      console.log("Registration saved and email sent successfully.");
    } catch (error) {
      console.error("Error saving registration and sending email:", error);
    }
  };

  // Gọi hàm saveInvoiceAndSendEmail trong useEffect hoặc ở nơi bạn cần
  useEffect(() => {
    saveInvoiceAndSendEmail();
    const queryParams = new URLSearchParams(location.search);

    // Get the paymentId and PayerID from the URL
    const paymentId = queryParams.get("paymentId");
    const payerId = queryParams.get("PayerID");
    const orderId = queryParams.get("orderId");

    if (paymentId && payerId) {
      getIdSale(paymentId, payerId);
    }
    else if (orderId){
      saveTTDK(orderId)
    } 

  }, []);

  return (
    <div className="success-page-container" style={{ marginTop: 100 }}>
      <h1>Thanh toán thành công</h1>
      <p>Cảm ơn bạn đã thanh toán!</p>
      <div className="info-container">
        <h2>Thông Tin Bãi Xe</h2>
        <div className="info-box">
          <p>
            <strong>Tên Xe:</strong> {choDoDetail.tenXe}
          </p>
          <p>
            <strong>Tên Bãi Xe:</strong> {choDoDetail.tenBai}
          </p>
          <p>
            <strong>Địa Chỉ:</strong> {choDoDetail.diaChi}
          </p>
          <p>
            <strong>Khu Đỗ Xe:</strong> {choDoDetail.tenKhu}
          </p>
        </div>
      </div>
      <PDFLink registration={choDoDetail} /> {/* Include PDFLink component */}
      <PaymentSuccessPage />
    </div>
  );
};

export default SuccessPage;
