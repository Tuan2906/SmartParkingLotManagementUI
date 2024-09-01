import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { Button, Modal } from "react-bootstrap";

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: "logout",
      payload: "",
    });
    nav("/"); // Redirect to the home page after logout
    console.log("Logout clicked");
  };

  return (
    <>
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        color: "#ffffff",
        padding: "0.5em",
        position: "fixed", // Add this
        top: 0, // Add this
        width: "100%", // Add this
        height: 100,
        zIndex: 1000, // Add this
      }}
    >
      <div
        style={{
          fontSize: "1.5em",
          marginLeft: "1em",
        }}
      >
        <Link
          to="/Home"
          style={{
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          BÃI ĐỖ XE ABC
        </Link>
      </div>
      <nav>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
          }}
        >
          <li
            style={{
              marginRight: "20px",
            }}
          >
            <Link
              to="/Home"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
          </li>
          <li
            style={{
              marginRight: "20px",
            }}
          >
            <Link
              to="/about"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              About
            </Link>
          </li>
          <li
            style={{
              marginRight: "20px",
            }}
          >
            <Link
              to="/contact"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Contact
            </Link>
          </li>
          <li
            style={{
              marginRight: "20px",
            }}
          >
            <Link
              to="/Conversations"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Conversation
            </Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={user.avatar}
          alt="Avatar"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "10px",
            cursor:"pointer",
          }}
          onClick={() => nav("/profile")}
        />
        <span
          style={{
            fontSize: "1.2em",
            marginRight: "20px",
          }}
        >
          {user.username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff0000",
            color: "#ffffff",
            border: "none",
            padding: "0.5em 1em",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
            LOGOUT
        </button>
      </div>

    </header>
    </>
    
  );
};

export default Header;
