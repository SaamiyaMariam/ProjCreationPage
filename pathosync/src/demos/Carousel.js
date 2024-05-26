import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Carousel({ projectId }) {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get(`/projects/${projectId}/datasets`);
                setDatasets(response.data);
            } catch (error) {
                console.error('Error fetching datasets', error);
            }
        };

        fetchDatasets();
    }, [projectId]);

    return (
        <div className="carousel">
            {datasets.map(dataset => (
                <img key={dataset.id} src={dataset.thumbnail_url} alt="thumbnail" />
            ))}
        </div>
    );
}

export default Carousel;
