import { useEffect, useRef, useState } from "react";
// import { Button, Card, CardTitle, Col, Container, Image, NavDropdown, Row  } from "react-bootstrap";
import {
  faClock,
  faStar,
  faMapMarkerAlt,
  faEye,
  faStarHalfAlt,
  faLocationArrow,
  faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Container,
  Row,
  Col,
  Image,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import MapView from "./Map";
import cookies from "react-cookies";
import getParking from "../loadAPI";
import { authApi, endpoints } from "../../configs/APIs";
import axios from "axios";
import MySpinner from "../Common/Spiner";

const Home = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [form, setForm] = useState({
    diachi: "",
    thoigiancua: "",
    thoigiandongcua: "",
    rate: null,
    page: 1,
  });
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [message, setMessage] = useState("");
  const [change, setChange] = useState(false);
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const nav = useNavigate();
  const divRef = useRef(null); // Tham chiếu đến div chứa danh sách
  const markers = [
    {
      geocode: [48.86, 2.3522],
      popUp: "Hello, I am pop up 1",
    },
    {
      geocode: [48.85, 2.3522],
      popUp: "Hello, I am pop up 2",
    },
    {
      geocode: [48.855, 2.34],
      popUp: "Hello, I am pop up 3",
    },
    {
      geocode: [48.865, 2.34],
      popUp: "Hello, I am pop up 3",
    },
    {
      geocode: [48.875, 2.34],
      popUp: "Hello, I am pop up 3",
    },
    {
      geocode: [48.885, 2.34],
      popUp: "Hello, I am pop up 3",
    },
    {
      geocode: [48.895, 2.34],
      popUp: "Hello, I am pop up 3",
    },
    {
      geocode: [48.95, 2.34],
      popUp: "Hello, I am pop up 3",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const { scrollTop, scrollHeight, clientHeight } = divRef.current;
  //     if (scrollTop + clientHeight >= scrollHeight) {
  //       // Kiểm tra nếu kéo đến cuối div
  //       console.log("ancawda");
  //       setForm((prevForm) => ({
  //         ...prevForm,
  //         page: prevForm.page + 1, // Tăng trang khi kéo đến cuối
  //       }));
  //     }
  //   };

  //   const divElement = divRef.current;
  //   divElement.addEventListener("scroll", handleScroll); // Thêm sự kiện scroll

  //   // Dọn dẹp sự kiện khi component bị hủy
  //   return () => {
  //     divElement.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
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
  const loadParking = async (form) => {
    let data = await getParking(cookies.load("access-token"), form);

    setParkingLots(data); // Nối dữ liệu mới vào dữ liệu cũ
  };
  useEffect(() => {
    loadParking(form);
  }, [form]);

  useEffect(() => {
    // Kiểm tra xem API Geolocation có được hỗ trợ không
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLat(undefined);
          setLong(undefined);
          setMessage("Vị trí của tôi");
        },
        (error) => {
          console.error("Lỗi lấy vị trí: ", error);
        }
      );
    } else {
      console.log("Geolocation không được hỗ trợ trong trình duyệt của bạn.");
    }
  }, [change]);

  const getDes = (lat, long) => {
    setLat(lat);
    setLong(long);
  };
  const handlePageChange = (pageNumber) => {
    console.log("page",pageNumber);
    setForm((prevForm) => ({
     ...prevForm,
      page: pageNumber,
    }));
    setCurrentPage(pageNumber);
};
  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
                style={{
                    padding: '8px 12px',
                    margin: '0 2px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    backgroundColor: number === currentPage ? '#007bff' : '#fff',
                    color: number === currentPage ? '#fff' : '#007bff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, color 0.3s',
                    fontSize: '14px',
                    fontWeight: number === currentPage ? 'bold' : 'normal',
                }}
                className="page-item"

            >
                {number === currentPage ? number.toString().charAt(0) : number}
            </Pagination.Item>
        );
    }
    return items;
};
  return (
    <div
      style={{
        width: "100%",
        marginTop: "10%",
        marginBottom: "5%",
        display: "flex",
      }}
    >
      <div className="p-3" style={{ width: "50%" }}>
        <div style={{ display: "flex" }}>
          <h3 style={{ marginLeft: 20 }}>BÃI ĐỖ</h3>
          <Pagination style={{ display: "flex", padding: 5 }}>
            {renderPagination()}
          </Pagination>
        </div>

        <div style={{ display: "flex" }}>
          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "3%",
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
              style={{ padding: 3 }}
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
              style={{ padding: 3 }}
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
              style={{ padding: 3 }}
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
              style={{ padding: 3 }}
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

          <Button
            onClick={() => setChange(!change)}
            variant="outline-primary"
            className="mt-3 w-100"
            style={{
              backgroundColor: "#007bff",
              borderRadius: "50px",
              background: "linear-gradient(145deg, #f0f0f0, #cacaca)",
              boxShadow: "6px 6px 12px #c5c5c5, -6px -6px 12px #fbfbfb",
              padding: 10,
              marginLeft: "10px",
            }}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ marginRight: "5px" }}
            />
          </Button>
        </div>
        <div
          ref={divRef}
          style={{
            height: "calc(100vh - 100px)", // Adjust this height based on your header/footer height
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {parkingLots === undefined ? (
            <Spinner animation="grow" variant="success" />
          ) : (
            parkingLots.map((lot, index) => (
              <Card
                key={index}
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
                        onClick={() => {
                          nav("/detail", {
                            state: {
                              name: lot.tenBai,
                              id: lot.id,
                              rate: lot.avgRate,
                              nv: lot.user_id,
                              diaChi: lot.diachi,
                            },
                          });
                          localStorage.removeItem("ChoUpdate");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ marginRight: "5px" }}
                        />
                        View Details
                      </Button>
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
                          marginLeft: "10px",
                        }}
                        onClick={() =>
                          getDes(
                            markers[index].geocode[0],
                            markers[index].geocode[1]
                          )
                        }
                      >
                        <FontAwesomeIcon
                          icon={faLocationArrow}
                          style={{ marginRight: "5px" }}
                        />
                        Chỉ Đường
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="m-3" style={{ width: "50%" }}>
        <MapView
          latitude={latitude}
          longitude={longitude}
          popUp={message}
          lat={lat}
          long={long}
        />
      </div>
    </div>
  );
};

export default Home;
