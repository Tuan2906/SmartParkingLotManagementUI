import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Footer from "./layout/Footer";
import { createContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";

import cookie from "react-cookies";
import LoginNV from "./components/Login";
import Home from "./components/Home";
import ParkingAccordion from "./components/Detail";
import ListTTDK from "./components/RegistryPark";
import Conversation from "./components/Conversation";
import Chat from "./components/Chat";

export const MyUserContext = createContext();
export const MyDispatchContext = createContext();

function MainContent() {
  const location = useLocation();

  // Kiểm tra đường dẫn hiện tại
  const hideHeaderFooter =
    location.pathname === "/";

  return (
    <Container>
      {/* Chỉ hiển thị Header và Footer nếu không phải trang Login hoặc OTP */}
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<LoginNV />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Detail" element={<ParkingAccordion />} />
        <Route path="/ttdk" element={<ListTTDK />} />
        <Route path="/Conversations" element={<Conversation />} />
        <Route path="/Chat" element={<Chat />} />

      </Routes>

      {!hideHeaderFooter && <Footer />}
    </Container>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookie.load("user") || null
  );

  // Kiểm tra đường dẫn hiện tại
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MainContent />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
