import React, { useContext, useState } from "react";
import "../../../Assest/Login.css";
import cookies from "react-cookies";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MySpinner from "../../Common/Spiner";
import APIs, { authApi, endpoints } from "../../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../../configs/Context";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../Chat/firebaseConfig";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };
  return (
    <div className={`containerS ${isSignIn ? "" : "active"}`} id="container">
      <div className={`form-container ${isSignIn ? "sign-in" : "sign-up"}`}>
        {isSignIn ? (
          <SignInForm />
        ) : (
          <SignUpForm setIsSignIn={setIsSignIn} isSignIn={isSignIn} />
        )}
      </div>
      <div className="toggle-container">
        <TogglePanel isSignIn={isSignIn} onToggle={toggleForm} />
      </div>
    </div>
  );
};

const SignUpForm = ({ setIsSignIn, isSignIn }) => {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirm: "",
    avatar: "",
    phone: "",
    email: "",
  });
  const nav = useNavigate();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Now `imageUrl` contains the uploaded image URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImage(reader.result);
        console.log("Image loaded", reader.result);

        const { name } = e.target;
        setUser({ ...user, [name]: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", user);
    if (user.avatar) {
      const formData = new FormData();
      for (const key in user) {
        formData.append(key, user[key]);
      }

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        let res = await APIs.post(endpoints["users"], formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", res);
        alert(
          "Tạo tài khoảng thành công, Vui lòng nhập lại username và password"
        );
        setIsSignIn(!isSignIn);
      } catch (error) {
        console.error("Error:", error);
        alert(error.response.data);
      }
    } else {
      alert("Hãy chọn ảnh avatar");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <div className="avatar-container">
        <div className="avatar">
          {image ? (
            <img src={image} alt="Avatar" />
          ) : (
            <i className="fas fa-user fa-3x"></i>
          )}
          <label htmlFor="file-upload" className="file-upload-label">
            <i className="fas fa-camera"></i>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            name="avatar"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <input
        type="text"
        placeholder="Họ"
        name="firstName"
        value={user.first_name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Tên"
        name="lastName"
        value={user.last_name}
        onChange={handleInputChange}
      />
      <input
        type="email"
        placeholder="email"
        name="email"
        value={user.email}
        onChange={handleInputChange}
      />
      <input
        type="number"
        placeholder="số điện thoại"
        name="phone"
        value={user.phone}
        onChange={handleInputChange}
      />

      <input
        type="text"
        placeholder="Username"
        name="username"
        value={user.username}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={user.password}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirm"
        value={user.confirm}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

const SignInForm = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault(); // Ngăn chặn hành động mặc định của form (refresh trang)
    try {
      console.log("username", username);
      console.log("pass", password);
      // Gửi yêu cầu HTTP sử dụng fetch hoặc axios
      let res = await APIs.post(endpoints["login"], {
        username: username,
        password: password,
      });
      console.log("res", res.data);
      // setTest(res.data.access_token)
      cookies.save("access-token", res.data);
      setTimeout(async () => {
        // setLoading(false);
        let userRes = await authApi(res.data).get(endpoints["current-user"]);
        cookies.save("user", userRes.data);
        dispatch({
          type: "login",
          payload: userRes.data,
        });
        nav("/OTP", { state: { email: userRes.data.email } });
      }, 100);
    } catch (ex) {
      console.error(ex);
      alert("Tài khoản bị khóa hoặc chưa đăng ký người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username) => {
    setLoading(true);
    try {
      console.log("username", username);
      // Gửi yêu cầu HTTP sử dụng fetch hoặc axios
      let res = await APIs.post(endpoints["LoginGG"], {
        username: username.email,
        avatar: username.photoURL
      });
      console.log("res", res.data);
      // setTest(res.data.access_token)
      cookies.save("access-token", res.data);
      // setLoading(false);
      let userRes = await authApi(res.data).get(endpoints["current-user"]);
      cookies.save("user", userRes.data);
      dispatch({
        type: "login",
        payload: userRes.data,
      });
      nav("/Home");

    } catch (ex) {
      console.error(ex);
      alert("Tài khoản bị khóa hoặc chưa đăng ký người dùng");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form (refresh trang)
    signInWithPopup(auth, provider).then((data) => {
      const { access_token } = data.user;
      // Lưu thông tin đăng nhập vào cookie
      console.log("use4name", data.user);
      localStorage.setItem("email", data.user.access_token);
      localStorage.setItem("user", access_token);
      handleLogin(data.user)
    });
  };
  return (
    <form onSubmit={loginUser}>
      <h1>Sign In</h1>
      <span>or use your email password</span>
      <input
        type="text"
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <a href="#">Forget Your Password?</a>
      {loading ? (
        <MySpinner animation="grow" size="sm" />
      ) : (
        <div style={{ display: "flex" }}>
          <button type="submit">Sign In</button>
          <button
            style={{
              backgroundColor: "#512da8", // Màu nền xanh của Google
              color: "white", // Màu chữ
              border: "none",
              borderRadius: "10px", // Bo góc
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Đổ bóng
              transition: "background-color 0.3s ease", // Hiệu ứng chuyển màu
              marginLeft: 5,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3367d6")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4285f4")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.backgroundColor = "#2b5dab")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.backgroundColor = "#3367d6")
            }
            onClick={(e) => handleGoogleLogin(e)}
          >
            <i className="fab fa-google"></i>
          </button>
        </div>
      )}
    </form>
  );
};

const TogglePanel = ({ isSignIn, onToggle }) => {
  return (
    <div className="toggle">
      <div
        className={`toggle-panel ${isSignIn ? "toggle-left" : "toggle-right"}`}
      >
        {isSignIn ? (
          <>
            <h1>Welcome Back!</h1>
            <button className="hidden" onClick={onToggle}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <h1>Hello, Friend!</h1>
            <button className="hidden" onClick={onToggle}>
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
