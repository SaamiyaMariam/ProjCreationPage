import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectPage from './demos/ProjectPage';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<ProjectPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
