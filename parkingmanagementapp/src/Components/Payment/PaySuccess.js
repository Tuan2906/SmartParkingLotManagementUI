import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { authApi, endpoints } from "../../configs/APIs";
import cookies from "react-cookies";

const PaymentSuccessPage = () => {

  

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <Link to="/Home">
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: 10,
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Quay về trang chủ
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
