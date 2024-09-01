import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Alert, Spinner, Pagination } from 'react-bootstrap';
import cookie from 'react-cookies';
import StarRatings from 'react-star-ratings';
import './RegistrationHistory.css';
import { authApi, endpoints } from '../../../configs/APIs';
import cookies from "react-cookies";
import PDFLink from '../../Tiket/ExportPDF';
import { useNavigate } from 'react-router-dom';

const RegistrationHistory = () => {
    const [registrations, setRegistrations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const nav = useNavigate();

    const GetLichSuDangKyChoDo = async (page = 1) => {
        setLoading(true);
        try {
            const { id } = cookie.load("user");
            let url = `${endpoints['lichsuChoDoXe']}?userId=${id}&page=${page}`;
            let res = await authApi(cookies.load("access-token")).get(url);
            console.log("re", res.data);

          
            setRegistrations(res.data);
            setTotalPages(4); // Cập nhật tổng số trang
        } catch (error) {
            console.error("Error fetching registration history:", error);
            setError("Có lỗi xảy ra khi tải dữ liệu lịch sử đăng ký. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetLichSuDangKyChoDo(currentPage);
    }, [currentPage]);

    const handleCancel = async (id_chodo) => {
        try {
            let url = endpoints['HuyDangKyCho'](id_chodo);
            let res = await authApi(cookies.load("access-token")).post(url);
            console.log("re", res.status);
            GetLichSuDangKyChoDo(currentPage); // Lấy dữ liệu lại sau khi hủy
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            setError("Có lỗi xảy ra khi hủy đăng ký.");
        }
    };
     const handleUpdateRating = async (id_ttdk) => {
        try {
            let url = endpoints['UpdateActiveDangKyCho'](id_ttdk);
            let res = await authApi(cookies.load("access-token")).post(url);
            console.log("re", res.status);
            GetLichSuDangKyChoDo(currentPage); // Lấy dữ liệu lại sau khi hủy
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            setError("Có lỗi xảy ra khi hủy đăng ký.");
        }
    };

    const handleShowModal = (registration) => {
        setSelectedRegistration(registration);
        setSelectedId(registration.id_chodo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedId(null);
        setSelectedRegistration(null);
        setShowModal(false);
    };
    const handleShowReviewModal = (registration) => {
        setSelectedRegistration(registration);
        setRating(registration.rating || 0); // Set the existing rating if available
        setComment(registration.comment || ''); // Set the existing comment if available
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        console.log("dsadda",selectedRegistration.id)
        setRating(0);
        setComment('');
        setShowReviewModal(false);
    };

    const luuRating = async () => {
        try {
            
            const ratingDTO = {
                id: selectedRegistration ? selectedRegistration.id : null,
                baidoxeId: selectedRegistration ? selectedRegistration.id_Bai : null,
                rate: rating,
                createdDate: new Date().toISOString(),
                comments: comment,
                username: cookie.load("user").username,
                avatar: cookie.load("user").avatar
            };

            console.log("rating", ratingDTO);
            let res = await authApi(cookies.load("access-token")).post(endpoints['danhGia'], ratingDTO);
              await handleUpdateRating(selectedRegistration.id);
            console.log("rescAR", res.data);
        } catch (error) {
            console.error("Error saving review:", error);
            setError("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    const handleSubmitReview = async () => {
        if (rating <= 0 || comment.trim() === '') {
            setError("Vui lòng nhập điểm đánh giá và nhận xét.");
            return;
        }
        try {
            await luuRating();
            handleCloseReviewModal();
            GetLichSuDangKyChoDo(currentPage);
        } catch (error) {
            console.error("Error submitting review:", error);
            setError("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    const isReviewable = (thoiGianRaBai) => {
        const exitTime = new Date(thoiGianRaBai);
        const currentTime = new Date();
        return exitTime < currentTime;
    };

    const isCancelable = (thoiGianVoBai) => {
        const entryTime = new Date(thoiGianVoBai);
        const currentTime = new Date();
        console.log( entryTime)
        console.log( currentTime)

        console.log( entryTime > currentTime)
        return entryTime > currentTime;
    };

    const handlePageChange = (pageNumber) => {
        console.log("page",pageNumber);
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                    style={{
                        padding: '8px 12px',
                        margin: '0 2px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        backgroundColor: number === currentPage ? '#007bff' : '#fff',
                        color: number === currentPage ? '#fff' : '#007bff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, color 0.3s',
                        fontSize: '14px',
                        fontWeight: number === currentPage ? 'bold' : 'normal',
                    }}
                    className="page-item"

                >
                    {number === currentPage ? number.toString().charAt(0) : number}
                </Pagination.Item>
            );
        }
        return items;
    };
    
    const handleUpdateCho    = (ChoUpdate) => {
        console.log("ChoUpdate",ChoUpdate);
        localStorage.setItem('ChoUpdate',JSON.stringify(ChoUpdate));
        nav('/detail');
    };
    

    return (
        <Container className="mt-4 " style={{marginTop:100}}>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <Table className="custom-table" striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Tên Xe</th>
                                <th>Tên Bãi Xe</th>
                                <th>Khu Đỗ Xe</th>
                                <th>Vị Trí</th>
                                <th>Giá</th>
                                <th>Thời Gian Vào Bãi</th>
                                <th>Thời Gian Ra Bãi</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration, index) => (
                                <tr key={registration.id}>
                                    <td>{registration.tenXe}</td>
                                    <td>{registration.tenBaiXe}</td>
                                    <td>{registration.khuDoXe}</td>
                                    <td>{registration.vitri}</td>
                                    <td>{registration.gia}</td>
                                    <td>{registration.thoiGianVoBai}</td>
                                    <td>{registration.thoiGianRaBai}</td>
                                    <td>
                                        {registration.isHuy ? "Đã Hủy" : "Chưa Hủy"}
                                    </td>
                                    <td>
                                        {!registration.isHuy && (
                                            <div className="action-buttons">
                                                {/* <PDFLink registration={registration} /> */}
                                                {isReviewable(registration.thoiGianRaBai) ? (
                                                    registration.active == true? (
                                                        <Button variant="secondary">
                                                            Đã Đánh Giá 
                                                        </Button>
                                                    ) : (
                                                        <Button variant="info" onClick={() => handleShowReviewModal(registration)}>
                                                            Đánh Giá
                                                        </Button>
                                                    )
                                                ) : null}
                                                {isCancelable(registration.thoiGianVoBai) && (
                                                    <Button variant="danger" onClick={() => handleCancel(registration.id)}>
                                                        Hủy
                                                    </Button>
                                                )}
                                                {isCancelable(registration.thoiGianVoBai) && (
                                                    <Button variant="danger" onClick={
                                                        () => {
                                                            const choDetails = {
                                                                id_ttdk :registration.id,
                                                                tenBai: registration.tenBaiXe,
                                                                tenKhu: registration.khuDoXe,
                                                                vitri: registration.vitri,
                                                                gia: registration.gia,
                                                                Vo: registration.thoiGianVoBai,
                                                                Ra: registration.thoiGianRaBai,
                                                                id_Bai: registration.id_Bai,
                                                                update: 1,
                                                                diaChi: registration.diaChi
                                                              };
                                                            handleUpdateCho(choDetails)
                                                        }}>

                                                        Chỉnh sửa
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Phân trang */}
                    <Pagination style={{display:"flex", padding:5}}>
                        {renderPagination()}
                    </Pagination>
                </>
            )}

            {/* Modal thông tin đăng ký */}
            {/* <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông Tin Đăng Ký</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRegistration && (
                        <div>
                            <p><strong>Tên Xe:</strong> {selectedRegistration.tenXe}</p>
                            <p><strong>Tên Bãi Xe:</strong> {selectedRegistration.tenBaiXe}</p>
                            <p><strong>Thời Gian Vào Bãi:</strong> {selectedRegistration.thoiGianVoBai}</p>
                            <p><strong>Thời Gian Ra Bãi:</strong> {selectedRegistration.thoiGianRaBai}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* Modal đánh giá */}
            <Modal show={showReviewModal} onHide={handleCloseReviewModal} dialogClassName="modal-dialog-centered">
    <Modal.Header closeButton>
        <Modal.Title>Đánh Giá</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedRegistration && (
            <div className="modal-content-center">
                <p><strong>Tên Xe:</strong> {selectedRegistration.tenBaiXe}</p>
                <StarRatings
                    rating={rating}
                    starRatedColor="yellow"
                    changeRating={setRating}
                    numberOfStars={5}
                    name='rating'
                />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập nhận xét của bạn"
                    rows="4"
                    style={{ width: '100%', marginTop: '10px' }}
                />
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseReviewModal}>
            Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmitReview}>
            Gửi Đánh Giá
        </Button>
    </Modal.Footer>
</Modal>


        </Container>
    );
};

export default RegistrationHistory;
