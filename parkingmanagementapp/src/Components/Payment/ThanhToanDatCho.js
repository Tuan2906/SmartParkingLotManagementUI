import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import { authApi, endpoints } from '../../configs/APIs';
import cookies from "react-cookies";
import axios from 'axios';

// Initialize Stripe

const InfoThanhToan = () => {
  const [paymentMethod, setPaymentMethod] = useState('Paypal'); // Track selected payment method
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const location = useLocation();
  const [message, setMessage] = useState("");

  const isActive = location.state?.isActive;
  const choDoDetail =  JSON.parse(localStorage.getItem('choDoDetail'));
  console.log(choDoDetail)

  // Function to fetch the list of vehicles
  const GetdsCarData = async () => {
    try {
        const accessToken = cookies.load("access-token")
        console.log("accessToken",accessToken)
        let res = await authApi(accessToken).get(endpoints['danhsachxe']);
        console.log("rescAR", res.data);
        setVehicles(res.data);
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
  };

  // Fetch vehicle data on component mount and when `isActive` changes
  useEffect(() => {
    GetdsCarData();
  }, [isActive]);

  // Handle adding a new vehicle
  const handleAddVehicle = () => {
    navigate('/registCart', { state: { isActive: true } });
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change currency as needed
    }).format(amount);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

  };

  // Handle vehicle selection
  const handleVehicleSelection = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'addNew') {
      handleAddVehicle();
    }
    const selectedVehicleObj = vehicles.find(v => v.id == selectedValue);
    console.log(selectedVehicleObj)
    if (selectedVehicleObj) {
      const { id, tenXe } = selectedVehicleObj;
      console.log("idxe",id)
      console.log("tenXe",tenXe)

      // Lấy thông tin hiện tại từ localStorage
      const choDoDetailString = localStorage.getItem('choDoDetail');
      const choDoDetail = choDoDetailString ? JSON.parse(choDoDetailString) : {};
  
      // Cập nhật thông tin xe vào đối tượng choDoDetail
      const updatedChoDoDetail = {
        ...choDoDetail,
        idXe: id,
        tenXe: tenXe
      };
  
      // Lưu đối tượng đã cập nhật vào localStorage
      localStorage.setItem('choDoDetail', JSON.stringify(updatedChoDoDetail));
    }
    
  };
  const handlePayMomo = async (payMomo) => {
    const formData = new FormData();
    formData.append("amount", payMomo);
    formData.append("redirectUrl", "acn");
    const url = endpoints["momo"];
    let res = await authApi(cookies.load("access-token")).post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 200) {
      window.location.href = res.data;
    } else {
      setMessage("Có l��i xảy ra, vui lòng thử lại.");
    }
  };

  const convertVNDToUSD = async (amountInVND) => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/VND`
      );
      const exchangeRate = response.data.rates.USD;
      const amountInUSD = (amountInVND * exchangeRate).toFixed(1);
      return amountInUSD;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      throw new Error("Không thể chuyển đổi tiền tệ");
    }
  };
  const handlePayPal = async (amount) => {
    const formData = new FormData();
    let amountUSD = await convertVNDToUSD(amount);
    try{
      formData.append("amount", amountUSD);
      
      const url = endpoints["paypal"];
      let res = await authApi(cookies.load("access-token")).post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        window.location.href = res.data;
      }
    }
    catch(error){
      console.error("Error in payPal:", error);
      setMessage("Có l��i xảy ra, vui lòng thử lại.");
    }
    
 
  };
  const saveTTDK = async () => {
    try {
      // Lấy thông tin từ localStorage
      const choDoDetailString = localStorage.getItem("choDoDetail");
      const choDoDetail = choDoDetailString
        ? JSON.parse(choDoDetailString)
        : {};
      console.log(parseFloat(choDoDetail.gia).toFixed(1));
      // Tạo đối tượng dữ liệu gửi lên backend
      const accessToken = cookies.load("access-token");
      console.log(choDoDetail.idXe);
      const response = await authApi(accessToken).post(
        endpoints["saveThongTinDangKy"],
        {
            xeId: choDoDetail.idXe,
            thoiGianVoBai: new Date(choDoDetail.Vo).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
            thoiGianRaBai: new Date(choDoDetail.Ra).toISOString().slice(0, 19), // Format theo "yyyy-MM-dd'T'HH:mm:ss"
            choDoId: choDoDetail.id_cho,
            isHuy: false, 
            id: choDoDetail.id_TTDK
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

  const handleUpdate = ()=>{
    localStorage.removeItem("ChoUpdate");
    saveTTDK();
    navigate('/HistoryRegistryPark');
  }
  return (
    <Container style={containerStyle}>
      {localStorage.getItem("ChoUpdate")?<h1 style={headerStyle}>Thông tin cập nhật vé</h1> :<h1 style={headerStyle}>Thanh toán</h1>}
      <Form>
        <Form.Group controlId="formBai" style={formGroupStyle}>
          <Form.Label>Tên Bãi</Form.Label>
          <Form.Control type="text" placeholder="Nhập tên bãi" style={inputStyle} disabled={true} value={choDoDetail.tenBai} />
        </Form.Group>

        <Form.Group controlId="formDiaChi" style={formGroupStyle}>
          <Form.Label>Địa Chỉ Bãi</Form.Label>
          <Form.Control type="text" placeholder="Nhập địa chỉ bãi" style={inputStyle} disabled={true} value={choDoDetail.diaChi} />
        </Form.Group>

        <Form.Group controlId="formKhu" style={formGroupStyle}>
          <Form.Label>Tên Khu</Form.Label>
          <Form.Control type="text" placeholder="Nhập tên khu" style={inputStyle} disabled={true} value={choDoDetail.tenKhu} />
        </Form.Group>

        <Form.Group controlId="formViTri" style={formGroupStyle}>
          <Form.Label>Vị Trí Cho Đỗ</Form.Label>
          <Form.Control type="text" placeholder="Nhập vị trí cho đỗ" style={inputStyle} disabled={true} value={choDoDetail.vitri} />
        </Form.Group>

        <Form.Group controlId="formSelectVehicle" style={formGroupStyle}>
          <Form.Label>Chọn Xe</Form.Label>
          <Form.Control as="select" onChange={handleVehicleSelection} style={inputStyle}>
            <option value="">Chọn xe</option>
            {vehicles && vehicles.map((v) => (
              <option value={v.id} key={v.id}>{v.tenXe}</option>
            ))}
            <option value="addNew">Thêm Xe Mới</option>
          </Form.Control>
        </Form.Group>

        {!localStorage.getItem("ChoUpdate") && <Form.Group as={Row} style={paymentMethodGroupStyle}>
          <Form.Label as="legend" column sm={4} style={paymentMethodLabelStyle}>
            Hình thức thanh toán
          </Form.Label>
            <Form.Check
              type="radio"
              label="MoMo"
              name="paymentMethod"
              id="momo"
              value="momo"
              onChange={() => handlePaymentMethodChange('momo')}
              style={paymentMethodOptionStyle}
            />
            <Form.Check
              type="radio"
              label="Paypal"
              name="paymentMethod"
              id="Paypal"
              value="Paypal"
              checked={true}
              onChange={() => handlePaymentMethodChange('Paypal')}
              style={paymentMethodOptionStyle}
            />

        </Form.Group>}

        {localStorage.getItem("ChoUpdate")? 
         <Button
         variant="success"
         size="lg"
         block
         onClick={handleUpdate}
         style={{...paymentButtonStyle}}
       >
         Cập nhật
       </Button>
        : 
        <Button
          variant="success"
          size="lg"
          block
          onClick={paymentMethod === 'Paypal' ? () => handlePayPal(choDoDetail.gia) :() => handlePayMomo(choDoDetail.gia)}
          style={{...paymentButtonStyle}}
        >
          Thanh toán
        </Button>
        }
      </Form>
    </Container>
  );
};
const containerStyle = {
  maxWidth: '600px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin:"100px auto"
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const formGroupStyle = {
  marginBottom: '16px',
  display: 'flex',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginLeft: '16px',

};

const paymentMethodGroupStyle = {
  marginBottom: '16px',
  display: 'flex',
};

const paymentMethodLabelStyle = {
  fontWeight: 'bold',
};

const paymentMethodOptionStyle = {
  marginRight: '15px',
  marginLeft: '16px',
};

const paymentButtonStyle = {
  marginTop: '20px',
  backgroundColor: '#28a745',
  borderColor: '#28a745',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  display: 'block',
  width: '100%',
  
};
export default InfoThanhToan;
