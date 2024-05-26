// ProjectsList.js
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
function ProjectsList({ projects, onFileChange }) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const carouselContainerStyle = {
        width: '60%',
        marginleft: '10%'  
    };
    
    return (
        <div>
            <h2>Projects</h2>
            {projects.length === 0 ? (
                <p>No projects available.</p>
            ) : (
                <ul>
                    {projects.map(project => (
                        <li key={project._id}>
                            <p>Project ID: {project._id}</p>
                            <p>Project Name: {project.name}</p>
                            <p>Dataset Type: {project.datasetType}</p>
                            <p>Number of Classes: {project.numClasses}</p>
                            <p>Class Names: {project.classNames.join(', ')}</p>
                            <input 
                                type="file" 
                                multiple 
                                onChange={(e) => onFileChange(project._id, e)}
                            />
                            {project.images.length > 0 && (
                                <div>
                                    <h4>Dataset</h4>
                                    <div style={carouselContainerStyle}>
                                    <Carousel responsive={responsive}>
                                            {project.images.map((image, index) => (
                                                <div key={index}>
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${image.filename}`} 
                                                        alt={`Image ${index}`} 
                                                        style={{ maxWidth: '150px', maxHeight: '150px' }} 
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectsList;
