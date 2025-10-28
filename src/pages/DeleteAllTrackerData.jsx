import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";

function DeleteAllTrackerData() {
    // ensures the user is connected to codebeamer to access page
    const sessionReady = useSessionGuard();

    // constants to be filled with chosen options
    const [projectNames, setProjectNames] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    const [trackerOptions, setTrackerOptions] = useState([]);
    const [selectedTrackerId, setSelectedTrackerId] = useState('');


    // retrieves project names
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

    // logic for user selecting project from dropdown
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


    // handle logic for submission of delete button 
    const handleDelete = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/delete_tracker_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    tracker_id: selectedTrackerId,
                })
            });

            const data = await res.json();
            setResponseMessage(data.message || 'Success');
        } catch (err) {
            console.error('Error deleting tracker items:', err);
            setResponseMessage('Failed to delete tracker items');
        }
    };

    return (
        <div>
            <h1>Delete All Tracker Data</h1>
            <p>! WARNING: This task will delete ALL items in the selected tracker below</p>
            {responseMessage && (
                <div
                    style={{
                    marginTop: '1rem',
                    }}
                >
                    {responseMessage}
                </div>
            )}
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Project</h4>
                    <select value={selectedProject} onChange={handleProjectSelect}>
                        <option value="">Select a project</option>
                        {projectNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                        {console.log('There are this many projects: ', projectNames.length)}
                    </select>
            </div>
            { trackerOptions.length > 0 && (
                <div>
                    <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                        <h4>Tracker</h4>
                        <select value={selectedTrackerId} onChange={(e) => setSelectedTrackerId(e.target.value)}>
                            <option value="">Select a tracker</option>
                            {trackerOptions.map((tracker) => (
                                <option key={tracker.id} value={tracker.id}>{tracker.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <button onClick={handleDelete}>Delete Tracker Data</button>
        </div>
    )
}

export default DeleteAllTrackerData;