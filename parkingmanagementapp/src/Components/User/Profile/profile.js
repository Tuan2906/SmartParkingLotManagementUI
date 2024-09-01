import React, { useContext } from "react";
import { MyUserContext } from "../../../configs/Context";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit,FaMotorcycle,FaHistory    } from 'react-icons/fa';

const Profile = () => {
  const user = useContext(MyUserContext);
  const nav = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        marginTop: 100,
      }}
    >
      <img
        src={user.avatar}
        alt="Avatar"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          marginBottom: "20px",
        }}
      />
      <h1
        style={{
          fontSize: "60px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {user.username}
      </h1>
      <Button
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          border: "1px solid #000",
          margin:"15px"
        }}
        onClick={() => nav("/update_user", { state: { user: user} })}
      >
                <FaEdit size={24}  style={{marginRight:10}} />
                Cập nhật thông tin
      </Button>
      <Button
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          border: "1px solid #000",
          margin:"15px"

        }}
        onClick={() => nav("/listCart")}
      >        <FaMotorcycle size={24} style={{marginRight:10}}/>

        Thông tin xe
      </Button>
      <Button
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          border: "1px solid #000",
          margin:"15px"
        }}
        onClick={() => nav("/HistoryRegistryPark")}
        >        <FaHistory size={24}  style={{marginRight:10}}/>
        Lịch sử đăng ký
      </Button>
    </div>
  );
};

export default Profile;
