import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Image,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import APIs, { endpoints } from "../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../App";

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Quản Trị Xe</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user !== null && (
                <>
                  <Link to="/" className="nav-link text-danger">
                    <Image width={40} src={user.avatar} roundedCircle />
                    Chào {user.username}!
                  </Link>
                  <Button
                    className="btn btn-danger"
                    onClick={() => {
                      dispatch({ type: "logout" });
                      nav("/");
                    }}
                  >
                    Đăng xuất
                  </Button>
                </>
              )}
              <Link
                to="/Conversations"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  padding:5,
                  marginTop:5
                }}
              >
                Conversation
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
