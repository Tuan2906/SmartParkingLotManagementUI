
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Image, Row, Spinner } from "react-bootstrap";
import cookie from "react-cookies";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyCartContext } from "../App";
import APIs, { authAPIs, endpoints } from "../configs/APIs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEye, faMapMarkerAlt, faStar, faStarHalfAlt  , faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [parkingLots, setParkingLots] = useState([]);
    const [change, setChange] = useState(false);
    const nav = useNavigate();
    const [form, setForm] = useState({
        diachi: "",
        thoigiancua: "",
        thoigiandongcua: "",
        rate: null,
      });
    const getParking = async () => {
        try {
          let url = `${endpoints["staffBaiDoXe"]}?q=${form.diachi}&thoigiancua=${form.thoigiancua}&thoigiandongcua=${form.thoigiandongcua}&avg=${form.rate}`;
          let res = await authAPIs().get(url);
          setParkingLots(res.data);
        } catch (ex) {
          console.error(ex);
        }
      };

      useEffect(() => {
        getParking();
      }, [change,form]);
      const renderStars = (avgRate) => {
        const stars = [];
        const fullStars = Math.floor(avgRate); // Số lượng ngôi sao đầy
        const hasHalfStar = avgRate % 1 !== 0; // Kiểm tra nếu có nửa sao
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số lượng ngôi sao rỗng
    
        // Thêm các ngôi sao đầy
        for (let i = 0; i < fullStars; i++) {
          stars.push(
            <FontAwesomeIcon
              key={`full-${i}`}
              icon={faStar}
              style={{ marginRight: "5px", color: "#ffc107" }}
            />
          );
        }
    
        // Thêm nửa ngôi sao nếu có
        if (hasHalfStar) {
          stars.push(
            <FontAwesomeIcon
              key="half"
              icon={faStarHalfAlt}
              style={{ marginRight: "5px", color: "#ffc107" }}
            />
          );
        }
    
        // Thêm các ngôi sao rỗng
        for (let i = 0; i < emptyStars; i++) {
          stars.push(
            <FontAwesomeIcon
              key={`empty-${i}`}
              icon={faStarEmpty}
              style={{ marginRight: "5px", color: "#ccc" }}
            />
          );
        }
    
        return stars;
      };
      const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
      const formatTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        const seconds = d.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      };
    return (<>
        <h1 className="text-center text-primary mt-1">DANH SÁCH BÃI XE</h1>
        <div
      style={{
        width: "100%",
        marginBottom: "5%",
        display: "flex",
      }}
    >
      <div className="p-3" style={{ width: "100%" }}>
        <div style={{ display: "flex" }}>
          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
              marginBottom: "5%"
            }}
          >
            <label htmlFor="diachi">Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              id="diachi"
              name="diachi"
              value={form.diachi}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
            }}
          >
            <label htmlFor="thoigiancua">Thời gian mở cửa</label>
            <input
              type="time"
              className="form-control"
              id="thoigiancua"
              name="thoigiancua"
              value={form.thoigiancua}
              onChange={handleChange}
            />
          </div>

          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
            }}
          >
            <label htmlFor="thoigiandongcua">Thời gian đóng cửa</label>
            <input
              type="time"
              className="form-control"
              id="thoigiandongcua"
              name="thoigiandongcua"
              value={form.thoigiandongcua}
              onChange={handleChange}
            />
          </div>

          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
            }}
          >
            <label htmlFor="rate">Đánh giá</label>
            <select
              className="form-control"
              id="rate"
              name="rate"
              value={form.rate}
              onChange={handleChange}
            >
              {[0, 1, 2, 3, 4, 5].map((number) => {
                if (number === 0) {
                  return (
                    <option key={number} value={null}>
                      Chưa đánh giá
                    </option>
                  );
                }
                return (
                  <option key={number} value={number}>
                    {number}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
            }}
          ></div>
        </div>
        <div
          style={{
            height: "calc(100vh - 100px)", // Adjust this height based on your header/footer height
            paddingRight: "10px",
          }}
        >
          {parkingLots !== undefined &&
            parkingLots.map((lot, index) => (
              <Card
                key={lot.id}
                className="mb-3 shadow-sm"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div style={{ flex: "0 0 200px", marginRight: "15px" }}>
                    <Image
                      src={lot.picture}
                      thumbnail
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        width: 200,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Card.Title style={{ fontWeight: "bold", color: "#000" }}>
                      {lot.tenBai}
                    </Card.Title>
                    <Card.Subtitle
                      style={{
                        fontSize: "0.9rem",
                        color: "#6c757d",
                        marginBottom: "10px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{ marginRight: "5px", color: "#6c757d" }}
                      />
                      <strong>{lot.diachi}</strong>{" "}
                    </Card.Subtitle>
                    <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      <strong>
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: "5px", color: "#007bff" }}
                        />
                        Open Time:
                      </strong>{" "}
                      {formatTime(lot.thoigiancua)}
                    </p>
                    <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      <strong>
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: "5px", color: "#007bff" }}
                        />
                        Close Time:
                      </strong>{" "}
                      {formatTime(lot.thoigiandongcua)}
                    </p>
                    <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      <strong>Rating:</strong> {renderStars(lot.avgRate)}
                    </p>
                    <div>
                      <Button
                        variant="outline-primary"
                        className="mt-3 w-100"
                        style={{
                          backgroundColor: "#007bff",
                          borderRadius: "50px",
                          background:
                            "linear-gradient(145deg, #f0f0f0, #cacaca)",
                          boxShadow:
                            "6px 6px 12px #c5c5c5, -6px -6px 12px #fbfbfb",
                          padding: 10,
                        }}
                        onClick={() => nav("/detail",{ state: { name:lot.tenBai, id: lot.id, rate:lot.avgRate,nv:lot.user_id} })}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ marginRight: "5px" }}
                        />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>

    </>);
}

export default Home;