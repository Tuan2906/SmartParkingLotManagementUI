import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useLocation } from "react-router";
import cookie from "react-cookies";
import axios from "axios";

const ListTTDK = () => {
  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const cardStyle = {
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  };

  const cardHeaderStyle = {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px 8px 0 0",
    textAlign: "center",
    marginBottom: "10px",
  };

  const cardBodyStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: "15px",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    marginRight: "15px",
  };

  const infoStyle = {
    flex: 1,
    textAlign: "left",
  };

  const cardFooterStyle = {
    padding: "10px",
    textAlign: "center",
  };

  const refundButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const refundButtonHoverStyle = {
    ...refundButtonStyle,
    backgroundColor: "#45a049",
  };
  const [TTDK, setTTDK] = useState();
  const location = useLocation();
  const chodo_id = location.state?.id;
  const [filterTime, setFilterTime] = useState({
    username: "",
    thoiGianVaoBai: "",
    thoiGianRaBai: "",
    bienso: "",
  });
  const [tthd, setTTHD] = useState();
  const handleTimeChange = (type, event) => {
    const value = event.target.value;
    setFilterTime((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  const getTTDK = async () => {
    try {
      let url = `${endpoints["thongtindangky"]}?choDoId=${chodo_id}&bienso=${filterTime.bienso}&vb=${filterTime.thoiGianVaoBai}&rb=${filterTime.thoiGianRaBai}&name=${filterTime.username}`;
      let res = await authAPIs().get(url);
      console.log("      console.log(res.data);",res.data);
      setTTDK(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(() => {
    getTTDK();
  }, [filterTime]);
  const convertVNDToUSD = async (amountInVND) => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/VND`
      );
      const exchangeRate = response.data.rates.USD;
      const amountInUSD = (amountInVND * exchangeRate).toFixed(2);
      return amountInUSD;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      throw new Error("Không thể chuyển đổi tiền tệ");
    }
  };
  const handleRefund = async (idTTDK) => {
    try {
      console.log(idTTDK)

      let url = `${endpoints["hoadon"](idTTDK)}`;
      let res = await authAPIs().get(url);
      const hdid = res.data.id;
      console.log( await convertVNDToUSD(res.data.soTien))
      console.log(res.data.uid)

      const formData = new FormData();
      formData.append("amount",await convertVNDToUSD(res.data.soTien));
      formData.append("saleId", res.data.uid);

       url = endpoints["refund"];
      res = await authAPIs().post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đặt header cho multipart/form-data
        },
      });

      console.log(hdid)
      console.log(cookie.load("user").id)
      const formData2 = new FormData();
      formData2.append("hdid",hdid);
      formData2.append("uid", cookie.load("user").id);
      res = await authAPIs().post(endpoints["addHoanTien"],formData2);
      alert("Hoàn tiền thành công")
      getTTDK();
      console.log(res.data)
    } catch (ex) {
      console.error(ex);
    }
  };
  return (
    <>
      <div style={{ marginTop: "10px", display: "flex" }}>
      <p>
          <strong>Thời gian vào bãi: </strong>{" "}
        </p>
        <input
          type="datetime-local"
          value={filterTime.thoiGianVaoBai}
          onChange={(e) => handleTimeChange("thoiGianVaoBai", e)}
          style={{
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        />
        <p>
          <strong>Thời gian ra bãi: </strong>{" "}
        </p>
        <input
          type="datetime-local"
          value={filterTime.thoiGianRaBai}
          onChange={(e) => handleTimeChange("thoiGianRaBai", e)}
          style={{
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        />
        
        <p>
          <strong>Username </strong>{" "}
        </p>
        <input
          type="text"
          value={filterTime.username}
          onChange={(e) => handleTimeChange("username", e)}
          style={{
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        />
        <p>
          <strong>Biển số </strong>{" "}
        </p>
        <input
          type="text"
          value={filterTime.bienso}
          onChange={(e) => handleTimeChange("bienso", e)}
          style={{
            marginRight: "10px",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        />
      </div>
      <div style={containerStyle}>
        {TTDK &&
          TTDK.map((item) => (
            <div key={item.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3>ID: {item.id}</h3>
              </div>
              <div style={cardBodyStyle}>
                <img src={item.image} alt="Car" style={imageStyle} />
                <div style={infoStyle}>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <p>
                      <strong>Tên xe:</strong> {item.tenXe}
                    </p>
                    <p>
                      <strong>Biển số:</strong> {item.bienSo}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <p>
                      <strong>Thời gian ra bãi:</strong> {item.thoiGianRaBai}
                    </p>
                    <p>
                      <strong>Thời gian vào bãi:</strong> {item.thoiGianVoBai}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <p>
                      <strong>Thời gian đăng ký:</strong> {item.thoiGianDangKy}
                    </p>
                    <p>
                      <strong>Người đăng ký:</strong> {item.username}
                    </p>
                  </div>
                </div>
              </div>
              {item.isHuy && item.id_ht==null && (
                <div style={cardFooterStyle}>
                  <button
                    style={refundButtonStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        refundButtonHoverStyle.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        refundButtonStyle.backgroundColor)
                    }
                    onClick={() => handleRefund(item.id)}
                  >
                    Hoàn tiền
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default ListTTDK;
