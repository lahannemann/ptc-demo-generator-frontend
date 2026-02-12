import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function DeleteAllTrackerData() {
    // ensures the user is connected to codebeamer to access page
    const sessionReady = useSessionGuard();

    const { projectNames, error: projectsError } = getProjects(sessionReady);
    const [selectedProject, setSelectedProject] = useState('');

    const { trackerOptions, error: trackerError } = getTrackers(selectedProject);
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
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
        const res = await fetch(`${API_BASE_URL}/api/delete_tracker_data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tracker_id: selectedTrackerId,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to delete tracker data');
        return data?.detail || 'Tracker data was deleted successfully.';
    };

    return (
        <div>
            <h1>Delete All Tracker Data</h1>
            <p>! WARNING: This task will delete ALL items in the selected tracker below</p>
            <div className='form-row'>
                <h4>Project</h4>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">Select a project</option>
                    {projectNames.map((name, index) => (
                        <option key={index} value={name} >{name}</option>
                    ))}
                </select>
            </div>
            {trackerOptions.length > 0 && (
                <div>
                    <div className='form-row'>
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

export default DeleteAllTrackerData;