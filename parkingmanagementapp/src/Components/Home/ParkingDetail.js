import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faCar,
  faDoorOpen,
  faDollarSign,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaRegCommentDots } from "react-icons/fa";

import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css/effect-coverflow";
import cookies from "react-cookies";
import {
  getChoDoDaDangKy,
  getParkingDetail,
  getPhuongTien,
  getPicBai,
} from "../loadAPI";
import Button from "react-bootstrap/Button";
import ParkComments from "./Comments";
import { Alert } from "react-bootstrap";

const ParkingDetail = () => {
  const location = useLocation();
  const parking_name = location.state?.name;
  const parking_id = location.state?.id;
  const parking_rate = location.state?.rate;
  const parking_nv = location.state?.nv;
  const parking_diachi = location.state?.diaChi;
  const [parking, setParking] = useState();
  const [ChoDo, setChodo] = useState();
  const [pic, setPic] = useState();
  const [style, setStyle] = useState([]);
  const [styleCho, setStyleCho] = useState([]);
  const [phuongtien, setPhuongTien] = useState();
  const [ArrayDangKy, setArrayDangKy] = useState([]);
  const nav = useNavigate();
  const ChoUpdate =  JSON.parse(localStorage.getItem('ChoUpdate'));
  const [filterTime, setFilterTime] = useState({
    thoiGianVaoBai: ChoUpdate? ChoUpdate.Vo.replace(' ', 'T').slice(0, -3):"",
    thoiGianRaBai: ChoUpdate? ChoUpdate.Ra.replace(' ', 'T').slice(0, -3):"",
  });
  const [filter, setFilter] = useState({
    gia: ChoUpdate? ChoUpdate.gia:0,
    pt: "",
    vt: "",
    kc: "",
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    if (filterTime.thoiGianVaoBai != "" && filterTime.thoiGianRaBai != "") {
      setShowModal(false);
    } else {
      alert("Vui lòng chọn thời gian vào ra bãi và phương tiện");
    }
  };
  const loadParkingDetail = async () => {
    let data = '';
    console.log("filter",filter)
    if (parking_id){
      data = await getParkingDetail(
      cookies.load("access-token"),
      parking_id,
      filter
    );
    }
    else if (ChoUpdate) {
      console.log("filter",filter)
      data = await getParkingDetail(
        cookies.load("access-token"),
        ChoUpdate.id_Bai,
        filter
      );
    }
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA",data);

    setParking(data);
    setStyle(Array(data.length).fill({}));
    // const newStyleCho = data.map(item =>
    //   // Tạo mảng con với số lượng phần tử bằng soLuong của từng item
    //   Array(item.soLuong).fill({}).map((_, index) => ({

    //   }))
    // );
    // console.log(newStyleCho)
    // setStyleCho(newStyleCho);
  };
  const loadPic = async () => {
    let data = '';
    if (parking_id){
      data = await getPicBai(cookies.load("access-token"), parking_id);
    }
    else if (ChoUpdate) {
      data = await getPicBai(cookies.load("access-token"), ChoUpdate.id_Bai);
    }
    setPic(data);
  };
  const loadPhuongTien = async () => {
    let data = await getPhuongTien(cookies.load("access-token"));
    setPhuongTien(data);
  };
  const loadChoDaDangKy = async () => {
    
    let data = '';
    if (parking_id){
      data = await getChoDoDaDangKy(
      cookies.load("access-token"),
      parking_id,
      filterTime
    );
    }
    else if (ChoUpdate) {
     
      console.log("dataChoUpdate", ChoUpdate.id_Bai);
      data = await getChoDoDaDangKy(
        cookies.load("access-token"),
        ChoUpdate.id_Bai,
        filterTime
      );
      
    }
    console.log("dawdawdawd",data);
    setArrayDangKy(data);
    console.log("dawdawd", data);
  };
  useEffect(() => {
    loadParkingDetail();
  }, [parking_id, filter]);

  useEffect(() => {
    loadPic();
    loadPhuongTien();
  }, []);
  useEffect(() => {
    loadChoDaDangKy();
  }, [filterTime]);
  // useEffect(()=>{
  //   if (ChoDo===undefined) {
  //     setChodo(parking);
  //   }
  //   if (filter.vt!="" && filter.kc!=""){

  //   }
  // },[parking,filter])
  const handleChooseCho = (choDoDetail) => {
    console.log(choDoDetail)
    localStorage.setItem("choDoDetail", JSON.stringify(choDoDetail))
    navigate("/thanhtoan")
  };
  const handleSlideChange = (swiper) => {
    if (parking) {
      const activeIndex = swiper.activeIndex;
      const activeChoDo = parking[activeIndex];
      if (activeChoDo) {
        const newStyle = style.map((item, index) =>
          index === activeIndex ? { backgroundColor: "yellow" } : {}
        );
        console.log(newStyle);
        setStyle(newStyle); // Cập nhật lại state với mảng mới
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFilter((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeTime = (e) => {
    const { name, value } = e.target;
    setFilterTime((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = () => {
    // Xử lý khi nhấn vào nút
    nav("/chat", { state: { id_nv: parking_nv } });
  };
  return (
    <>
      <Button
        className="fixed-button message"
        style={{
          position: "fixed",
          bottom: "50%",
          right: 10,
          backgroundColor: "green",
          color: "#fff",
          borderRadius: 5,
          padding: "5px 10px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={handleClick}
      >
        <div href="#cart">
          <FaRegCommentDots size={20} className="cart-icon" />
        </div>
      </Button>
      <div
        style={{
          maxWidth: "100%",
          margin: "100px auto",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: 40,
            textAlign: "center",
            fontWeight: "lighter",
            marginBottom: 50,
          }}
        >
          <FontAwesomeIcon
            icon={faCar}
            style={{ marginRight: "5px", color: "#000" }}
          />
          BÃI ĐỖ XE <strong>{parking_name}</strong>
        </h1>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          style={{
            height: "300px",
          }}
        >
          {pic &&
            pic.map((image, index) => (
              <SwiperSlide
                key={index}
                style={{
                  textAlign: "center",
                }}
              >
                <img
                  src={image.namePic}
                  alt={"lỗi ảnh"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div
        style={{
          width: "98%",
          display: "flex",
          marginBottom: 100,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div style={{ width: "40%", height: "auto" }}>
          <h2>Khu Đô Xe</h2>
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleShowModal}
          >
            Filter
          </button>
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999999,
              }}
            >
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  width: "30%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    height: "95%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      padding: "10px",
                      textAlign: "center",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <h2>Filter</h2>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="gia"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Giá:
                      </label>
                      <input
                        type="number"
                        id="gia"
                        name="gia"
                        step="0.01"
                        value={filter.gia}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="khoangCach"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Khoảng cách:
                      </label>
                      <input
                        type="text"
                        id="khoangCach"
                        name="kc"
                        value={filter.kc}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="viTri"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Vị trí:
                      </label>
                      <input
                        type="text"
                        id="viTri"
                        name="vt"
                        value={filter.vt}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="thoiGianVaoBai"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Thời gian vào bãi:
                      </label>
                      <input
                        type="datetime-local"
                        id="thoiGianVaoBai"
                        name="thoiGianVaoBai"
                        value={filterTime.thoiGianVaoBai}
                        onChange={handleChangeTime}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="thoiGianRaBai"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Thời gian ra bãi:
                      </label>
                      <input
                        type="datetime-local"
                        id="thoiGianRaBai"
                        name="thoiGianRaBai"
                        value={filterTime.thoiGianRaBai}
                        onChange={handleChangeTime}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <label
                        htmlFor="phuongTien"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Phương tiện:
                      </label>
                      <select
                        id="phuongTien"
                        name="pt"
                        value={filter.pt}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      >
                        <option value="">Chọn phương tiện</option>
                        {phuongtien &&
                          phuongtien.map((option) => (
                            <option key={option.id} value={option.loai}>
                              {option.loai}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleHideModal}
                  variant="danger"
                  style={{
                    padding: 5,
                    color: "white",
                    margin: "15px 45%",
                    backgroundColor: "red",
                    borderRadius: "10%",
                  }}
                >
                  Close
                </Button>{" "}
              </div>
            </div>
          )}

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            onSwiper={handleSlideChange}
            onSlideChange={handleSlideChange}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            style={{
              height: "50%",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {parking &&
              parking.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                      width: "80%",
                      margin: "0 auto",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{ marginRight: "8px" }}
                      />
                      {item.tenDay}
                    </h3>
                    <p style={{ marginBottom: "10px" }}>
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        style={{ marginRight: "8px" }}
                      />
                      Giá: {item.gia}
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <FontAwesomeIcon
                        icon={faCar}
                        style={{ marginRight: "8px" }}
                      />
                      Phương tiện: {item.phuongtien}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div style={{ width: "55%", border: "2px solid #000" }}>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 5 }}
          >
            <FontAwesomeIcon
              icon={faDoorOpen}
              size="2x"
              title="Open Door"
              style={{ marginTop: 5 }}
            />
            <h1>Cửa (vị trí - khoảng cách)</h1>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "40px",
              width: "100%",
              margin: "0 auto",
              padding: 20,
            }}
          >
            {parking &&
              parking.map((item, index) => (
                <div
                  key={index}
                  style={{
                    flexBasis: "calc(50% - 20px)", // Chiếm 50% chiều rộng container trừ khoảng cách giữa các item
                    justifyContent: "space-between",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    height: "300px",
                    ...style[index],
                  }}
                >
                  <h2>
                    {item.idKhu} Dãy {item.tenDay} số lượng: {item.soLuong}
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {item.chodo.map((i, index) => {
                      // Tạo đối tượng dữ liệu trước
                      const choDetails = {
                        tenBai: ChoUpdate? ChoUpdate.tenBai: parking_name,
                        tenKhu: item.tenDay,
                        id_cho: i.id,
                        vitri: i.vitri,
                        khoangCach: i.khoangCach,
                        phuongtien: item.phuongtien,
                        gia: item.gia,
                        diaChi:  ChoUpdate? ChoUpdate.diaChi:parking_diachi,
                        Vo: filterTime.thoiGianVaoBai,
                        Ra: filterTime.thoiGianRaBai,
                        id_TTDK : ChoUpdate?.id_ttdk
                      };

                      return (
                        <button
                          key={index}
                          style={{
                            margin: 10,
                            padding: 10,
                            border: "none",
                            borderRadius: 5,
                            backgroundColor: ArrayDangKy.includes(i.id)
                              ? "red"
                              : "#4CAF50", // Kiểm tra i.id trong ArrayDangKy
                            color: "#fff",
                            cursor: "pointer",
                          }}
                          disabled ={ArrayDangKy.includes(i.id)? true: false}
                          onClick={() => handleChooseCho(choDetails)}
                        >
                          {i.id}-{i.vitri}-{i.khoangCach}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <ParkComments id_bai={parking_id} rate={parking_rate} /> */}
    </>
  );
};

export default ParkingDetail;
