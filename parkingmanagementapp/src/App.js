import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import Login from "./Components/User/Login/Login";
import "./App.css";
import OtpInput from "./Components/User/Login/OTPForm";
import OTP from "./Components/User/Login/OTP";
import Home from "./Components/Home/Home";
import Header from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import { useReducer } from "react";
import { MyUserReducer } from "./configs/MyReducer";
import cookies from "react-cookies";
import { MyUserContext, MyDispatchContext } from "./configs/Context";
import Profile from "./Components/User/Profile/profile";
import UpdateProfile from "./Components/User/Profile/UpdateUser";
import ParkingDetail from "./Components/Home/ParkingDetail";
import Chat from "./Components/Chat/Chat";
import Conversation from "./Components/Chat/Conversation";
import PaymentSuccessPage from "./Components/Payment/PaySuccess";
import InfoThanhToan from "./Components/Payment/ThanhToanDatCho";
import RegisterCar from "./Components/User/Profile/DangKyXe";
import SuccessPage from "./Components/Payment/Suceess";
import VehicleTable from "./Components/User/Profile/DanhSachXe";
import RegistrationHistory from "./Components/User/Profile/LichSuDangKyChoDoXe";
// import VehicleTable from "./Components/User/Profile/DanhSachXe";
// import RegistrationHistory from "./Components/User/Profile/LichSuDangKyChoDoXe";
// import SuccessPage from "./Components/Payment/Suceess";

function MainContent() {
  const location = useLocation();

  // Kiểm tra đường dẫn hiện tại
  const hideHeaderFooter =
    location.pathname === "/" || location.pathname === "/OTP";

  return (
    <Container>
      {/* Chỉ hiển thị Header và Footer nếu không phải trang Login hoặc OTP */}
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/OTP" element={<OTP length={6} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update_user" element={<UpdateProfile />} />
        <Route path="/detail" element={<ParkingDetail />} />
        {/* <Route path="/success" element={<PaymentSuccessPage />} /> */}
        <Route path="/Conversations" element={<Conversation />} />
        <Route path="/Chat" element={<Chat />} />

        <Route path="/thanhtoan" element={<InfoThanhToan />} />
        <Route path="/registCart" element={<RegisterCar />} />

        <Route path="/registCart/:id" element={<RegisterCar />} />
        <Route path="/listCart" element={<VehicleTable />} />
        <Route path="/HistoryRegistryPark" element={<RegistrationHistory />} />

        <Route path="/success" element={<SuccessPage />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </Container>
  );
}
function App() {
  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookies.load("user") || null
  );
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MainContent />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
