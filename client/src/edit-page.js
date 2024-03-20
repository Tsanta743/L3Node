import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditPage() {
    const { id } = useParams(); // Récupère l'identifiant de l'employé depuis l'URL
    const [employe, setEmploye] = useState({});

    useEffect(() => {
        // Effectuez une requête pour récupérer les détails de l'employé avec l'identifiant donné
        fetch(`http://localhost:5000/api/employesID/${id}`) // Utilisez id ici
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(`http://localhost:5000/api/employesID/${id}`)
                setEmploye(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des employés :', error));
    }, [id]);    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmploye({ ...employe, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Effectuez une requête PUT pour mettre à jour les détails de l'employé
        fetch(`http://localhost:5000/api/employes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employe)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des détails de l\'employé');
            }
            // Redirige vers la liste des employés après la mise à jour
            window.location.href = '/employees-list';
        })
        .catch(error => console.error('Erreur lors de la mise à jour des détails de l\'employé :', error));
    };

    return (
        <div className="container">
            <h1 className="text-center">Modifier les détails de l'employé</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nom" className="form-label">Nom:</label>
                    <input type="text" className="form-control" id="nom" name="nom" value={employe.nom || ''} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="salaire" className="form-label">Salaire:</label>
                    <input type="text" className="form-control" id="salaire" name="salaire" value={employe.salaire || ''} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
            </form>
        </div>
    );
}

export default EditPage;
