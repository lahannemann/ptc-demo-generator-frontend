import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function DeleteAllProjectData() {
    // ensures the user is connected to codebeamer to access this page
    const sessionReady = useSessionGuard();

    const { projectNames, error: projectsError } = getProjects(sessionReady);
    const [selectedProject, setSelectedProject] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();

    const deleteItems = async () => {
        const res = await fetch(`${API_BASE_URL}/api/delete_project_data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                project_name: selectedProject,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to delete project data');
        return data?.detail || 'Project data was deleted successfully.';
    };

    return (
        <div>
            <h1>Delete All Project Data</h1>
            <p>! WARNING: This task will delete ALL data in your project</p>
            <div className='form-row'>
                <h4>Project</h4>
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={!sessionReady}
                >
                    <option value="">Select a project</option>
                    {projectNames.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <div>
                <AsyncActionButton
                    isRunning={isRunning}
                    onRun={() => run(deleteItems)}
                    label="Delete"
                    busyLabel="Deleting..."
                    successOpen={showSuccessPopup}
                    onSuccessClose={() => setShowSuccessPopup(false)}
                    failureOpen={showFailurePopup}
                    onFailureClose={() => setShowFailurePopup(false)}
                    message={responseMessage}
                />
            </div>
        </div>
    )
}

export default DeleteAllProjectData;