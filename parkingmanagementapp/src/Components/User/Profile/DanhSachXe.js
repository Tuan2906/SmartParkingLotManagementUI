import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from "react-cookies";
import { authApi, endpoints } from '../../../configs/APIs';
import cookies from "react-cookies";
import './VehicleTable.css'; // Import tệp CSS

const VehicleTable = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const GetdsCarData = async () => {
        try {
            let res = await authApi(cookies.load("access-token")).get(endpoints['danhsachxe']);
            setVehicles(res.data);
        } catch (error) {
            console.error("Error fetching car data:", error);
            setError("Lỗi khi tải dữ liệu xe.");
        }
    };
   
    useEffect(() => {
        GetdsCarData();
    }, []);

    const handleAddClick = () => {
        navigate("/registCart");
    };

    const handleUpdate = (idXe) => {
        navigate(`/registCart/${idXe}`);
    };

    const handleDeleteClick = (idXe) => {
        setVehicleToDelete(idXe);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await authApi(cookies.load("access-token")).delete(`${endpoints['danhsachxe']}${vehicleToDelete}`);
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete));
            setVehicleToDelete(null);
            setShowConfirmDelete(false);
        } catch (error) {
            console.error("Error deleting car:", error);
            setError("Lỗi khi xóa xe.");
        }
    };

    return (
        <div className="containerXe">
            {error && <div className="alert">{error}</div>}
            <h1>Danh sách xe</h1>
            <button className="add-button" onClick={handleAddClick}>
                Add Vehicle
            </button>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hình Ảnh</th>
                        <th>Tên Xe</th>
                        <th>Biển Số</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle, index) => (
                        <tr key={vehicle.id}>
                            <td>{index + 1}</td>
                            <td>
                                <button
                                    className="image-button"
                                    onClick={() => setSelectedImage(vehicle.image)}
                                >
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.tenXe}
                                        className="vehicle-image"
                                    />
                                </button>
                            </td>
                            <td>{vehicle.tenXe}</td>
                            <td>{vehicle.bienSo}</td>
                            <td>
                                <button className="update-button" onClick={() => handleUpdate(vehicle.id)}>
                                    Update
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteClick(vehicle.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
                        <img src={selectedImage} alt="Vehicle" className="modal-image" />
                    </div>
                </div>
            )}

            {showConfirmDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setShowConfirmDelete(false)}>&times;</span>
                        <p>Are you sure you want to delete this vehicle?</p>
                        <button className="cancel-button" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                        <button className="confirm-delete-button" onClick={handleConfirmDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleTable;
