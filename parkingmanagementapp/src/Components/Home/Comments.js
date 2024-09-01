import cookies from "react-cookies";
import { Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { getComment, SaveComment } from "../loadAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faStar,
  faMapMarkerAlt,
  faEye,
  faStarHalfAlt,
  faLocationArrow,
  faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating-stars-component";

const ParkComments = ({ id_bai, rate }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };
  const loadComments = async () => {
    setLoading(true);
    const data = await getComment(cookies.load("access-token"), id_bai);
    console.log("daaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(data);
    setComments(data);
  };

  const addComment = async () => {
    const form = {
      baidoxeId: id_bai,
      comments: newCommentText,
      createDate:new Date(),
      rate: rating,
    }
    const data = await SaveComment(cookies.load("access-token"), form);
    alert("Đánh giá thành công")
    setComments([data,...comments]);
    setShowModal(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addComment();
    }
  };
  const ratingChanged = (newRating) => {
    console.log(newRating);
    handlePressConfirm(newRating);
    setRating(newRating);
  };

  const handlePressConfirm = async (rating) => {
    //   if (rating) {
    //     try {
    //       let token = await cookies.load('access-token');
    //       let res = await authApi(token).post(endpoints['rates'](post_id), {
    //           'rate': rating
    //       })
    //            alert("Đánh giá thành công");
    //       } catch (ex) {
    //           console.error(ex);
    //           alert("Bạn đẵ đáng giá bài post này rồi!");
    //           return;
    //       }
    //     //Cho nay xu ly lu du lieu json
    //  } else {
    //     console.log('Vui lòng chọn rating');
    //   }
  };
  useEffect(() => {
    loadComments();
  }, [id_bai, page]);

  const setIdxPage = (index) => {
    setPage(index);
  };
  const renderStars = (avgRate) => {
    const stars = [];
    const fullStars = Math.floor(avgRate); // Số lượng ngôi sao đầy
    const hasHalfStar = avgRate % 1 !== 0; // Kiểm tra nếu có nửa sao
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số lượng ngôi sao rỗng

    // Thêm các ngôi sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          style={{ marginRight: "5px", color: "#ffc107" }}
        />
      );
    }

    // Thêm nửa ngôi sao nếu có
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          style={{ marginRight: "5px", color: "#ffc107" }}
        />
      );
    }

    // Thêm các ngôi sao rỗng
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarEmpty}
          style={{ marginRight: "5px", color: "#ccc" }}
        />
      );
    }

    return stars;
  };
  return (
    <Row style={{ marginTop: 100, marginBottom: 50 }}>
      <div style={{ display: "flex" }}>
        <h1>Bình luận</h1>
        <div
          className="rating-container"
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          {renderStars(rate)}
        </div>
      </div>
      <Row className="Comment">
        <div className="Comment" style={{ display: "flex" }}>
          
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleShowModal}
          >
            Đánh giá
          </button>
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "30%",
                height: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999999,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  width: "80%",
                  height: "80%",
                  padding: 10,
                }}
              >
                <h2>Đánh Giá</h2>
                <img
            src={cookies.load("user").avatar}
            alt="user"
            width={39}
            height={30}
            style={{ borderRadius: "50%" }}
          />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nhập bình luận..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #000",
                    outline: "none",
                    padding: 6,
                    width: "100%",
                  }}
                />
                <div className="rate-button-container fixed-button rate">
                  <div className="rating-container hover-text">
                    <Rating
                      count={5}
                      onChange={ratingChanged}
                      size={30}
                      activeColor="#ffd700"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    style={{
                      position: "absolute",
                      top: "80%",
                      right: "10%",
                      padding: 10,
                      backgroundColor: "green",
                      color: "white",
                    }}
                    onClick={addComment}
                  >
                    Gửi
                  </Button>
                  <Button
                    style={{
                      position: "absolute",
                      top: "80%",
                      right: "25%",
                      padding: 10,
                      backgroundColor: "red",
                      color: "white",
                    }}
                    onClick={handleHideModal}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Row>

      <div>
        {comments &&
          comments.map((cmt, index) => (
            <Row
              key={index}
              style={{
                padding: 10,
                marginTop: 30,
                borderTop: "0.5px solid #000",
              }}
            >
              <div style={{ marginLeft: 40 }}>
                {renderStars(cmt.rate)}
                <div>{cmt.comments}</div>
                <div>
                  {format(new Date(cmt.createdDate), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
            </Row>
          ))}
      </div>
    </Row>
  );
};

export default ParkComments;
