import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectCreation({ onProjectCreated }) {
    const [name, setName] = useState('');
    const [numClasses, setNumClasses] = useState('');
    const [datasetType, setDatasetType] = useState('');
    const [classNames, setClassNames] = useState(['']);
    const [message, setMessage] = useState('');

    const handleDatasetTypeChange = (e) => {
        const type = e.target.value;
        setDatasetType(type);
        if (type === 'cell') {
            setNumClasses(2);
            setClassNames(['Cell Images', 'Masks']);
        } else {
            setNumClasses(2);
            setClassNames(['Annotated', 'Unannotated']);
        }
    };

    const handleClassNameChange = (index, value) => {
        const newClassNames = [...classNames];
        newClassNames[index] = value;
        setClassNames(newClassNames);
    };

    const handleAddClass = () => {
        const newClassNames = [...classNames, ''];
        setClassNames(newClassNames);
        setNumClasses(newClassNames.length);
    };

    const handleNumClassesChange = (e) => {
        const newNumClasses = parseInt(e.target.value, 10);
        setNumClasses(newNumClasses);

        const newClassNames = [...classNames];
        if (newNumClasses > classNames.length) {
            for (let i = classNames.length; i < newNumClasses; i++) {
                newClassNames.push('');
            }
        } else {
            newClassNames.length = newNumClasses;
        }
        setClassNames(newClassNames);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/projects/create', {
                name,
                numClasses,
                datasetType,
                classNames,
            });
            setMessage(`Project created successfully: ${response.data.message}`);
            onProjectCreated();
        } catch (error) {
            console.error(error);  // Log the error object for debugging
            setMessage(error.response?.data?.error || 'Error creating project');
        }
    };

    useEffect(() => {
        if (datasetType && datasetType !== 'cell') {
            handleNumClassesChange({ target: { value: numClasses } });
        }
    }, [numClasses, datasetType]);

    return (
        <div>
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Dataset Type:</label>
                    <select value={datasetType} onChange={handleDatasetTypeChange} required>
                        <option value="">Select...</option>
                        <option value="cell">Cell</option>
                        <option value="tissue">Tissue</option>
                        <option value="wsi">WSI</option>
                    </select>
                </div>
                {datasetType && datasetType !== 'cell' && (
                    <div>
                        <label>Number of Classes:</label>
                        <input
                            type="number"
                            value={numClasses}
                            onChange={handleNumClassesChange}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Class Names:</label>
                    {classNames.map((className, index) => (
                        <input
                            key={index}
                            type="text"
                            value={className}
                            onChange={(e) => handleClassNameChange(index, e.target.value)}
                            required
                        />
                    ))}
                </div>
                {datasetType !== 'cell' && (
                    <button type="button" onClick={handleAddClass}>Add Class</button>
                )}
                <button type="submit">Create Project</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ProjectCreation;
