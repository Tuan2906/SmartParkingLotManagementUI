import { authApi, endpoints } from "../configs/APIs";

const getParking = async (accessToken, form) => {
  try {
    console.log("Getting", form);
    let url = `${endpoints["baixe"]}?page=${form.page}&q=${form.diachi}&thoigiancua=${form.thoigiancua}&thoigiandongcua=${form.thoigiandongcua}&avg=${form.rate}`;
    let res = await authApi(accessToken).get(url);
    console.log(res.data);
    return res.data;

  } catch (ex) {
    console.error(ex);
  }
};


export const getParkingDetail = async (accessToken, id_bai, filter) => {
  try {
    console.log("Getting",filter);
    let url = `${endpoints["detail"]}?baidoxeid=${id_bai}&gia=${filter.gia}&pt=${filter.pt}&vt=${filter.vt}&kc=${filter.kc}`;
    let res = await authApi(accessToken).get(url);
    return res.data;
  } catch (ex) {
    console.error(ex);
  }
};

export const getPicBai = async (accessToken, id_bai) => {
  try {
    let url = `${endpoints["pic"]}?baidoxeid=${id_bai}`;
    let res = await authApi(accessToken).get(url);
    return res.data;
  } catch (ex) {
    console.error(ex);
  }
};


export const getPhuongTien = async (accessToken) => {
  try {
    let url = `${endpoints["phuongtien"]}`;
    let res = await authApi(accessToken).get(url);
    return res.data;
  } catch (ex) {
    console.error(ex);
  }
};


export const getChoDoDaDangKy = async (accessToken, id_bai,filter) => {
  try {
    console.log("time",filter);
    let url = `${endpoints["getChoDoDaDangKy"]}?baiDoXe_id=${id_bai}&startTime=${filter.thoiGianVaoBai}&endTime=${filter.thoiGianRaBai}`;
    let res = await authApi(accessToken).get(url);
    return res.data;
  } catch (ex) {
    console.error(ex);
  }
};

export const getComment = async (accessToken, id_bai) => {
  try {
    let url = `${endpoints["comments"](id_bai)}`;
    let res = await authApi(accessToken).get(url);
    return res.data;
  } catch (ex) {
    console.error(ex);
  }
};

export const SaveComment = async (accessToken, form) => {
  try {
    let url = `${endpoints["add_comment"]}`;
    
    // Sử dụng phương thức POST để gửi dữ liệu JSON
    let res = await authApi(accessToken).post(url, form, {
      headers: {
        'Content-Type': 'application/json', // Đảm bảo rằng bạn gửi dữ liệu dưới dạng JSON
      }
    });
    return res.data;
  } catch (ex) {
    console.error(ex);
    throw ex; // Ném lại lỗi để hàm gọi có thể xử lý
  }
};
export default getParking;
