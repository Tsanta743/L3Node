const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion'
});

const getEmployes = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employe', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const deleteEmploye = (employeId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM employe WHERE numEmp = ?', [employeId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log('deleted employee ' + employeId);
                resolve(results);
            }
        });
    });
};

const getEmployeById = (employeId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employe where numEmp = ?', [employeId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = { getEmployes, deleteEmploye , getEmployeById };