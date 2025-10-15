// import statements later 
import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";


function GenerateItems() {
    const sessionReady = useSessionGuard();

    // create constants to store data 
    const [projectNames, setProjectNames] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    const [trackerOptions, setTrackerOptions] = useState([]);
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const [selectedRequirementType, setSelectedRequirementType] = useState('hardware');
    const [itemCount, setItemCount] = useState('');



    // functions to update inputs
    useEffect(() => {
        if (!sessionReady) return;
        const fetchProjectNames = async () => {
            try {
            const res = await fetch('http://localhost:8000/api/projects', {
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
            const res = await fetch('http://localhost:8000/api/trackers', {
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

    const handleGenerate = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/generate_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    requirement_type: selectedRequirementType,
                    tracker_id: selectedTrackerId,
                    item_count: parseInt(itemCount),
                    additional_rules: '' // need to add a field for this
                })
            });

            const data = await res.json();
            setResponseMessage(data.message || 'Success');
        } catch (err) {
            console.error('Error generating items:', err);
            setResponseMessage('Failed to generate items');
        }
    };


    return(
        <div>
            <h1>Item Generator</h1>
            <p>
                Automatically generate a specified number of top-level items in a 
                selected Codebeamer tracker using AI. Choose the requirement 
                type (hardware, software, or both), the target tracker where the 
                items will be created, and the number of items to generate. These 
                items will not be linked to any existing items and are intended to 
                serve as the starting point for decomposition in other trackers.
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
                    <h4>Requirement Type</h4>
                    <select value={selectedRequirementType} onChange={(e) => setSelectedRequirementType(e.target.value)}>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="both">Hardware & Software</option>
                    </select>
                </div>
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
                            <select value={selectedTrackerId} onChange={(e) => setSelectedTrackerId(e.target.value)}>
                                <option value="">Select a tracker</option>
                                {trackerOptions.map((tracker) => (
                                    <option key={tracker.id} value={tracker.id}>
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
                                onChange={(e) => setItemCount(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                
            </div>
            <button onClick={handleGenerate}>Generate</button>

        </div>
    )
}

export default GenerateItems;