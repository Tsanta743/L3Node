import React, { useState } from 'react';

function AddEmploye() {
    const [employe, setEmploye] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmploye({ ...employe, [name]: value });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        // Rediriger vers la liste des employés lorsque le bouton Annuler est cliqué
        window.location.href = '/';
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!employe.nom || !employe.salaire) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        // Effectuez une requête POST pour ajouter un nouvel employé
        fetch('http://localhost:5000/api/employes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employe)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'employé');
            }
            // Redirige vers la liste des employés après l'ajout
            window.location.href = '/';
        })
        .catch(error => console.error('Erreur lors de l\'ajout de l\'employé :', error));
    };

    return (
        <div className="container">
            <h1 className="text-center">Ajouter un nouvel employé</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nom" className="form-label">Nom:</label>
                    <input type="text" className="form-control" id="nom" name="nom" onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="salaire" className="form-label">Salaire:</label>
                    <input type="text" className="form-control" id="salaire" name="salaire" onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-outline-primary">Ajouter</button>
                <button className="btn btn-outline-danger" onClick={handleCancel}>Annuler</button>
            </form>
        </div>
    );
}

export default AddEmploye;
