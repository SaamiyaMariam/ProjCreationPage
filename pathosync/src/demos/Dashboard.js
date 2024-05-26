import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from './Carousel';

function Dashboard() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h2>Projects</h2>
            {projects.map(project => (
                <div key={project.id} className="project">
                    <h3>{project.name}</h3>
                    <p>Dataset Type: {project.dataset_type}</p>
                    <p>Number of Classes: {project.num_classes}</p>
                    <p>Class Names: {project.class_names.join(', ')}</p>
                    <Carousel projectId={project.id} />
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
