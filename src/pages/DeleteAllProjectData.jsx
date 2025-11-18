import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";

function DeleteAllProjectData() {
    // ensures the user is connected to codebeamer to access this page
    const sessionReady = useSessionGuard();

    // constants to be filled with chosen options
    const [projects, setProjects] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');

    // retrieves project names
    useEffect(() => {
        if (!sessionReady) return;
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/projects', {
                method: 'GET',
                credentials: 'include', // ensures session cookie is sent
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || 'Failed to fetch projects');
                }

                const data = await res.json();
                setProjects(data.projects || []); 
            } catch (err) {
                console.error('Error fetching projects:', err);
                setResponseMessage(err.message);
            }
        };

        fetchProjects();
    }, [sessionReady]);

    // logic for user selecting project from dropdown
    const handleProjectSelect = async (e) => {
        const projectID = e.target.value;
        setSelectedProjectId(projectID);
    };

    // handle logic for submission of delete button
    const handleProjectDelete = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/delete_project_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    project_id: selectedProjectId,
                })
            });

            const data = await res.json();
            setResponseMessage(data.message);
        } catch (err) {
            console.error('Error deleting project:', err);
            setResponseMessage('Failed to delete project data');
        }
    }

    return (
        <div>
            <h1>Delete All Project Data</h1>
            <p>! WARNING: This task will delete ALL data in your project</p>
            {responseMessage && (
                <div style={{marginTop: '1rem',}}>
                    {responseMessage}
                </div>
            )}
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Project</h4>
                    <select value={selectedProjectId} onChange={handleProjectSelect}>
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
            </div>
            <button onClick={handleProjectDelete}>Delete All Project Data</button>
        </div>
    )
}

export default DeleteAllProjectData;