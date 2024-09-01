import { useContext, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import cookie from "react-cookies";
import { Navigate, useNavigate } from "react-router";
import { MyDispatchContext, MyUserContext } from "../App";
import APIs, { authAPIs, endpoints } from "../configs/APIs";
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginNV = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            let res = await APIs.post(endpoints['login'], {
                "username": username,
                "password": password
            });
            cookie.save("token", res.data);
    
            let user = await authAPIs().get(endpoints['current-user']);
            if(user.data.role=="ROLE_ADMIN" ||user.data.role=="ROLE_STAFF")
            {
                console.log("usere",user.data);
        
                      //cookie.save("user", user.data);
                dispatch({
                  "type": "login",
                  "payload": user.data
              });
              nav("/Home")
            }
            else{
              alert("K có quyền truy cập");
            }
        }catch (ex) {
            console.error(ex);
            alert("Tài khoản bị khóa hoặc chưa đăng ký người dùng");
          } 
       
    }
    console.log("adawpdawidon")

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4">Login</h2>
        {err && <div className="alert alert-danger">Invalid credentials. Please try again.</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label visually-hidden">Username</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label visually-hidden">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-10">
          {loading &&
               (
                <Container className="d-flex justify-content-center align-items-center" style={{ height: '1vh' }}>
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </Container>
              )}

            <button type="submit" className="btn btn-primary d-block mx-auto" style={{margin:"20px"}}>Login</button>
            <p className="mt-100-alert alert-danger">Ghi Chú: Chỉ có nhân viên được phép đăng nhập.</p>

          </div>

        </form>
      </div>
    </div>
        </>
    );
}

export default LoginNV;