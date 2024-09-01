import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = "http://localhost:8080/QuanLyBaiDoXe/api";

export const endpoints = {
  "login": "/login",
  "current-user": "/current-user",
  "staffBaiDoXe": "/staffBaiDoXe",
  "getKhuDoXeByBaiDoXe": "/getKhuDoXeByBaiDoXe",
  "getChoDoByKhuAndBaiId": "/getChoDoByKhuAndBaiId",
  "thongtindangky": "/thongtindangky",
  "detail": "/getChiTietBai",
  "phuongtien": "/phuongtien",
  "refund": "/paypal/refund",
  "addHoanTien": '/userHoanTien',
  "hoadon": (ttdk_id) => `/Hoadon/${ttdk_id}`
};

export const authAPIs = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: cookie.load("token"),
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
