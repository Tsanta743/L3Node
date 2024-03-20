const express = require('express');
const app = express();
const path = require('path');
const dbConnect = require('./dbConnect');

app.use(express.static(path.join(__dirname, 'client/build')));

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autorise les requêtes depuis n'importe quelle origine
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Autorise les méthodes HTTP
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Autorise les en-têtes
    next();
});

// Route pour récupérer tous les employés
app.get('/api/employes', async (req, res) => {
    try {
        const employes = await dbConnect.getEmployes();
        res.json(employes);
    } catch (error) {
        console.error('Erreur lors de la récupération des employés :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
    }
});

// Route pour supprimer un employé par son ID
app.delete('/api/employes/:id', async (req, res) => {
    const employeId = req.params.id;
    try {
        await dbConnect.deleteEmploye(employeId);
        res.status(204).end(); // Réponse 204 No Content si la suppression réussit
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'employé :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
    }
});

app.get('/api/employesID/:id', async (req, res) => {
    const employeId = req.params.id;
    try {
        const employe = await dbConnect.getEmployeById(employeId);
        res.json(employe);
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'employé :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données de l\'employé' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur Express démarré sur le port ${PORT}`);
});
