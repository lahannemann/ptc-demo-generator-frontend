import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";


function BatchItemGenerator() {
    // ensures the user is connected to codebeamer to access page
    const sessionReady = useSessionGuard();

    const [projectNames, setProjectNames] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    const [trackerOptions, setTrackerOptions] = useState([]);
    const [selectedTrackerName, setSelectedTrackerName] = useState('');
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const [itemCount, setItemCount] = useState('');
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    // fetches project options for user to choose from 
    useEffect(() => {
        // only does so if the codebeamer connection is set up 
        if (!sessionReady) return;
        const fetchProjectNames = async () => {
            try {
            const res = await fetch(`${API_BASE_URL}/api/project_names`, {
                method: 'GET',
                credentials: 'include', // ensures session cookie is sent
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch project names');
            }

            const data = await res.json();
            setProjectNames(data.project_names || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setResponseMessage(err.message);
            }
        };

        fetchProjectNames();
    }, [sessionReady]);

    const handleProjectSelect = async (e) => {
        const projectName = e.target.value;
        setSelectedProject(projectName);

        try {
            const res = await fetch(`${API_BASE_URL}/api/trackers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName }),
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch trackers');
            }

            const data = await res.json();
            setTrackerOptions(data.trackers || []);
        } catch (err) {
            console.error('Error fetching trackers:', err);
            setResponseMessage(err.message);
        }
    };

    const handleTrackerSelect = async (e) => {
        const trackerName = e.target.name;
        const trackerId = e.target.value;

        setSelectedTrackerId(trackerId);
        setSelectedTrackerName(trackerName);

    }

    const validateItemCount = async (e) => {
        const inputValue = e.target.value

        if (inputValue === '' || !isNaN(+inputValue)) {
            setError(''); // clears the error if input is empty or a valid number
            setItemCount(inputValue);
        } else {
            setError('Please enter a valid number');
        }
    };

    const handleBatchItemGenerate = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/generate_batch_items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    tracker_id: selectedTrackerId,
                    tracker_name: selectedTrackerName,
                    item_count: itemCount,
                })
            });

            const data = await res.json();
            setResponseMessage(data.message);
        } catch (err) {
            console.error('Error generating batch items:', err);
            setResponseMessage('Failed to generate batch items');
        }
    };

    return (
        <div>
            <h1>Batch Item Generation</h1>
            <p>
                Generate up to thousands of items in a selected Codebeamer tracker without using AI. 
                Items are named sequentially using the format: "Tracker Name 1", "Tracker Name 2", 
                and so on. Ideal for quickly populating trackers with large volumes of placeholder 
                or test data.
            </p>
            {responseMessage && (
                <div
                    style={{
                    marginTop: '1rem',
                    }}
                >
                    {responseMessage}
                </div>
            )}
            <div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Project</h4>
                    <select value={selectedProject} onChange={handleProjectSelect}>
                        <option value="">Select a project</option>
                        {projectNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                {trackerOptions.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <h4>Tracker</h4>
                            <select value={selectedTrackerId} onChange={handleTrackerSelect}>
                                <option value="">Select a tracker</option>
                                {trackerOptions.map((tracker) => (
                                    <option key={tracker.id} name={tracker.name} value={tracker.id}>
                                        {tracker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                            <h4>Item Count</h4>
                            <input 
                                type="text"     
                                placeholder="Enter # of items"
                                value={itemCount}
                                onChange={validateItemCount}
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={handleBatchItemGenerate} >Generate</button>
        </div>
    );
}

export default BatchItemGenerator;