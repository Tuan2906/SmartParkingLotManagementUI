import axios from 'axios'
const BASE_URL = 'http://localhost:8080/QuanLyBaiDoXe/api';

export let endpoints = {
'login': '/login',
'current-user': '/current-user',
'users': "/users",
'email': '/send-email',
'baixe': '/HomeBaiDoXe',
'updateUser':(user_id) => `/user/${user_id}`,
'detail': '/getChiTietBai',
'pic': '/getPic',
'phuongtien': '/phuongtien',
'getChoDoDaDangKy':'/getChoDoDaDangKy',
'comments': (baidoxeId) =>`/rating/baidoxe/${baidoxeId}`,
'add_comment':'/rating/baidoxe',
"papalSuccess": "/success",
"paypal": "/paypal/pay",
'paypalSuccess' :"/successPaypal",
"momo": "/momo/createPayment",
"LoginGG": "/loginGG",
'danhsachxe':'/xe/',
'lichsuChoDoXe':'/lichsudangky',
'updateCar':(xe_id) => `/xe/${xe_id}/`,
'getCar':(id) => `/xe/${id}/`,
'registerCar':"/xeAdd/",
"danhGia":"/rating/baidoxe",
'HuyDangKyCho':(id)=>`/thongtindangky/${id}`,
'UpdateActiveDangKyCho':(id)=>`/thongtindangkyupdate/${id}`,
'sendMail':'/send-email',
'saveThongTinDangKy':'/saveThongTinDangKy',
// 'tag_posts': (tag_id) => `/tags/${tag_id}/posts/`,
// 'tag':'/tags/',
// 'posts': (post_id) => `/posts/${post_id}/`,
// 'payMomo':"/payUrl",
// 'comments': (post_id) => `/posts/${post_id}/comments/`,
// 'reply': (comment_id) => `/comments/${comment_id}/replies/`,
// 'add-comment': (post_id) => `/posts/${post_id}/comments/`,
// 'add-rep': (comment_id) => `/comments/${comment_id}/replies/`,
// 'add-cart': (post_id) => `/posts/${post_id}/userRegiterCartPost/`,
// 'cart' : 'users/cartUser/posts/',
// 'delete-cart': (post_id) => `/posts/${post_id}/deleteCart/`,
// 'rates':(rateId)=>`/posts/${rateId}/rates/`,

}
export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': accessToken
    }
})
export default axios.create({
    baseURL:BASE_URL
})
