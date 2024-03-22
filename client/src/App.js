import React from 'react';
import { Route, Routes , Link} from'react-router-dom';
import EmployesList from './EmployesList';
import EditPage from './edit-page';
import AddPage from "./AddEmployes";

function App() {
    return (
        <Routes>
            <Route path="/"  element={<EmployesList />} />
            <Route path="/edit-page/:id" element={<EditPage />} />
            <Route path="/add-page" element={<AddPage />} />
        </Routes> 
    );
}

export default App;
