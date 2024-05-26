// ProjectPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCreation from './ProjectCreation';
import ProjectsList from './ProjectsList';

function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [refresh]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleFileChange = async (project_id, e) => {
        const files = e.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        try {
            await axios.post(`http://localhost:5000/projects/${project_id}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Refresh projects after upload
            fetchProjects();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleProjectCreated = () => {
        setRefresh(!refresh);
    };

    return (
        <div>
            <ProjectCreation onProjectCreated={handleProjectCreated} />
            <ProjectsList projects={projects} onFileChange={handleFileChange} />
        </div>
    );
}

export default ProjectPage;
