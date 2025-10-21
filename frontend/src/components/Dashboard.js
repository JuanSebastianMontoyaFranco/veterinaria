import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';

const Dashboard = () => {
    const [pets, setPets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('/api/pets');
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    const handleShowModal = (pet) => {
        setSelectedPet(pet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPet(null);
    };

    return (
        <>
            <h1>Administración de Animales</h1>
            <Button variant="primary" className="mb-3">
                Crear Animal
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Raza</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map((pet) => (
                        <tr key={pet.id}>
                            <td>{pet.name}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.adoptionStatus}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowModal(pet)}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedPet && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedPet.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Raza:</strong> {selectedPet.breed}</p>
                        <p><strong>Estado:</strong> {selectedPet.adoptionStatus}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default Dashboard;
