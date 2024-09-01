import { useState, useRef, useEffect } from "react";
import { Alert, Button, Container, Form, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { authApi, endpoints } from "../../../configs/APIs";
import cookies from "react-cookies";

const RegisterCar = () => {
    const [car, setCar] = useState({
        carName: '',
        registrationNumber: '',
        image: '', // Thêm trường này để lưu ảnh xe hiện tại
    });
    const [err, setErr] = useState();
    const [isUpdate, setIsUpdate] = useState(false); // Để kiểm tra chế độ cập nhật
    const [selectedImage, setSelectedImage] = useState(''); // Trạng thái lưu ảnh được chọn
    const nav = useNavigate();
    const carImage = useRef();
    const location = useLocation();
    const isActive = location.state?.isActive;
    const { id } = useParams(); // Lấy id từ URL nếu có
    console.log("is",isActive)
    useEffect(() => {
        // Nếu có id, tải dữ liệu xe để cập nhật
        if (id) {
            setIsUpdate(true);
            const fetchCarData = async () => {
                console.log("id", id);
                try {
                    const accessToken = cookies.load("access-token")
                    let url = endpoints['getCar'](id);
                    let res = await authApi(accessToken).get(url);
                    console.log("res", res.data);
                    setCar({
                        carName: res.data.tenXe,
                        registrationNumber: res.data.bienSo,
                        image: res.data.image
                    });
                } catch (error) {
                    console.error("Error fetching car data:", error);
                }
            };
            fetchCarData();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (car.registrationNumber === undefined || car.registrationNumber.trim() === '')
            setErr("Biển số xe không hợp lệ!");
        else {
            let form = new FormData();
            form.append('tenXe', car.carName);
            form.append('bienSo', car.registrationNumber);

            if (carImage.current.files[0]) {
                form.append('file', carImage.current.files[0]);
            }

            try {
                const accessToken = cookies.load("access-token")
                if (isUpdate) {
                    // Cập nhật xe
                    
                    await authApi(accessToken).post(endpoints['updateCar'](id), form, {
                        headers: {
                            'Content-Type': "multipart/form-data"
                        }
                    });
                } else {
                    // Đăng ký xe mới
                    await authApi(accessToken).post(endpoints['registerCar'], form, {
                        headers: {
                            'Content-Type': "multipart/form-data"
                        }
                    });
                }
                if(isActive == true)
                {
                    return nav("/thanhtoan",{state: { isActive: false}})
                }
                nav("/listCart");
            } catch (error) {
                console.error("Error submitting form:", error);
                setErr("Đã xảy ra lỗi, vui lòng thử lại!");
            }
        }
    }

    const handleChange = (e, field) => {
        setCar({ ...car, [field]: e.target.value });
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setSelectedImage('');
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#f9f9f9',
            borderRadius: 10,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            width: '80%',
            margin: '100px auto'
          }}>
            <h1 style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 20
            }}>{isUpdate ? "CẬP NHẬT XE" : "ĐĂNG KÝ XE"}</h1>
            {err && <div style={{
              backgroundColor: '#f44336',
              color: '#fff',
              padding: 10,
              borderRadius: 5,
              marginBottom: 20
            }}>{err}</div>}
            <form style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }} onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <label style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 10
                }}>Tên xe</label>
                <input
                  type="text"
                  value={car["carName"]}
                  onChange={e => handleChange(e, "carName")}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: 10,
                    fontSize: 16,
                    border: '1px solid #ddd',
                    borderRadius: 5
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <label style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 10
                }}>Biển số xe</label>
                <input
                  type="text"
                  value={car["registrationNumber"]}
                  onChange={e => handleChange(e, "registrationNumber")}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: 10,
                    fontSize: 16,
                    border: '1px solid #ddd',
                    borderRadius: 5
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <label style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 10
                }}>Ảnh xe</label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedImage && <img src={selectedImage} alt="Selected Car" width={100} />}
                  {!selectedImage && car.image && <img src={car.image} alt="Car" width={100} />}
                </div>
                <input
                  accept=".png,.jpg"
                  type="file"
                  ref={carImage}
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: 10,
                    fontSize: 16,
                    border: '1px solid #ddd',
                    borderRadius: 5
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: 40,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                {isUpdate ? "Cập nhật" : "Đăng ký"}
              </button>
            </form>
          </div>
    );
}

export default RegisterCar;
