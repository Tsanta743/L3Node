import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Pour Chart.js
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'; // Pour Bootstrap


function EmployesList() {
    const [employes, setEmployes] = useState([]);
    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    let salaryChart;

    useEffect(() => {
        fetchEmployes();
    }, []);

    const fetchEmployes = () => {
        fetch('http://localhost:5000/api/employes')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setEmployes(data);
                calculateStatistics(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des employés :', error));
    };

    const calculateStatistics = (data) => {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;
        let total = 0;
        data.forEach(employe => {
            total += employe.salaire;
            if (employe.salaire < min) {
                min = employe.salaire;
            }
            if (employe.salaire > max) {
                max = employe.salaire;
            }
        });
        setMinSalary(min);
        setMaxSalary(max);
        setTotalSalary(total);
    };

    const determineObservation = (salaire) => {
        if (salaire < 1000) {
            return "Médiocre";
        } else if (salaire >= 1000 && salaire <= 5000) {
            return "Moyen";
        } else {
            return "Grand";
        }
    };

    const deleteRow = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")) {
            fetch(`http://localhost:5000/api/employes/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }
                // Mise à jour des données après la suppression
                fetchEmployes();
            })
            .catch(error => alert(error.message));
        }
    };
    

    const editRow = (id) => {
        // Redirige vers la page d'édition de l'employé avec l'identifiant donné
        // Remplacez "edit-page" par le chemin de votre page d'édition des employés
        window.location.href = `/edit-page/:${id}`;
    };
    

    const determineObservationStyle = (salaire) => {
        if (salaire < 1000) {
            return "text-danger"; // Rouge pour "Médiocre"
        } else if (salaire >= 1000 && salaire <= 5000) {
            return "text-warning"; // Jaune pour "Moyen"
        } else {
            return "text-success"; // Vert pour "Grand"
        }
    };    

    const showGraph = () => {
        // Préparez les données pour le graphique
        const totalSalary = employes.reduce((total, employe) => total + employe.salaire, 0);
        const minSalary = Math.min(...employes.map(employe => employe.salaire));
        const maxSalary = Math.max(...employes.map(employe => employe.salaire));
        const data = {
            labels: ['Salaire Total', 'Salaire Minimum', 'Salaire Maximum'],
            datasets: [{
                label: 'Salaire',
                data: [totalSalary, minSalary, maxSalary],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        };
    
        // Obtenez le contexte du canevas
        const ctx = document.getElementById('salaryChart').getContext('2d');
    
        // Créez le graphique
        if (typeof salaryChart !== 'undefined' && salaryChart !== null) {
            salaryChart.destroy(); // Détruisez le graphique précédent s'il existe
        }
        salaryChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: false,
                maintainAspectRatio: false
            }
        });
    
        // Affichez la modal du graphique
        var myModal = new bootstrap.Modal(document.getElementById('graphModal'));
        myModal.show();
    };
    

    const add = () => {
        window.location.href = '/add-page'
    };

    return (
        <div className="container">
            <h1 className="text-center">Résultat de la sélection de données</h1>
            <button type="button" onClick={add} className="btn btn-outline-success">Ajouter</button>
            <button type="button" onClick={showGraph} className="btn btn-outline-info">Graph</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Numero Employé</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Salaire</th>
                        <th scope="col">Observation</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employes.map(employe => (
                        <tr key={employe.numEmp}>
                            <td>{employe.numEmp}</td>
                            <td>{employe.nom}</td>
                            <td>{employe.salaire}</td>
                            <td className={determineObservationStyle(employe.salaire)}>{determineObservation(employe.salaire)}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => deleteRow(employe.numEmp)}>Supprimer</button>
                                <button className="btn btn-outline-primary" onClick={() => editRow(employe.numEmp)}>Modifier</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
        <td colSpan="3"><strong>Salaire minimum:</strong></td>
        <td colSpan="2">{minSalary}</td>
    </tr>
    <tr>
        <td colSpan="3"><strong>Salaire maximum:</strong></td>
        <td colSpan="2">{maxSalary}</td>
    </tr>
    <tr>
        <td colSpan="3"><strong>Salaire total:</strong></td>
        <td colSpan="2">{totalSalary}</td>
    </tr>
                </tbody>
            </table>
            <div className="modal fade" id="graphModal" tabIndex="-1" aria-labelledby="graphModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl" style={{ width: "435px" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="graphModalLabel">Graphique des salaires</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <canvas id="salaryChart" width="400" height="400"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployesList;
