import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css'; // Import CSS nếu bạn chưa import
import { authAPIs, endpoints } from '../configs/APIs';
import { useLocation, useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';

// Cập nhật danh sách khuDo và choDo với nhiều dữ liệu hơn


const ParkingAccordion = () => {
    const location = useLocation();
    const nav = useNavigate();

  const [detail, setDetail] = useState();
  const [openId, setOpenId] = useState(null);
  const [phuongtien, setPhuongTien] = useState();
  const parking_id = location.state?.id;
  const [filter, setFilter] = useState({
    gia: 0,
    pt: "",
    vt: "",
    kc: "",
  });
  const [showModal, setShowModal] = useState(false);
  const getPhuongTien = async () => {
    try {
      let url = `${endpoints["phuongtien"]}`;
      let res = await authAPIs().get(url);
      setPhuongTien(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };
   const getParkingDetail = async () => {
    try {
      let url = `${endpoints["detail"]}?baidoxeid=${parking_id}&gia=${filter.gia}&pt=${filter.pt}&vt=${filter.vt}&kc=${filter.kc}`;
      let res = await authAPIs().get(url);
      console.log(res.data);
      setDetail(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(()=>{
    getParkingDetail()
  },[filter])

  
  useEffect(()=>{
    getPhuongTien()
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFilter((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAccordionClick = (idKhu) => {
    console.log("dawdawdawdawdaw");
    console.log(idKhu);
    setOpenId(openId === idKhu ? null : idKhu);
  };

  return (
    <>    
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
                          padding: "0px",
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
    <Accordion allowMultipleExpanded={false}>
    {detail && detail.map((khu) => (
      <AccordionItem key={khu.idKhu}>
        <AccordionItemButton
          onClick={() => handleAccordionClick(khu.idKhu)}
          style={{
            width: '100%',
            padding: 15,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: 5,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          {khu.tenDay} - Phương tiện: {khu.phuongtien} - Giá: {khu.gia} VND
        </AccordionItemButton>
        <AccordionItemPanel>
          { (
            <div style={{ padding: 20 }}>
              {khu.chodo.map((cho) => (
                <div
                  key={cho.id}
                  style={{
                    marginBottom: 20,
                    padding: 20,
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    borderRadius: 8,
                  }}
                >
                  <p>
                    Vị trí: {cho.vitri} - Khoảng cách: {cho.khoangCach} km
                  </p>
                  <button
                    style={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      padding: 10,
                      border: 'none',
                      borderRadius: 5,
                      cursor: 'pointer',
                    }}
                    onClick={() => nav("/ttdk",{ state: { id: cho.id} })}
                    >
                    Xem thông tin đăng ký
                  </button>
                </div>
              ))}
            </div>
          )}
        </AccordionItemPanel>
      </AccordionItem>
    ))}
  </Accordion>
    </>

  );
};

export default ParkingAccordion;
