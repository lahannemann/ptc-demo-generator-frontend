import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';
import getTrackerItems from '../hooks/getTrackerItems';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';


function UpdateItemMetadata() {
    // constants to store user selections
    const sessionReady = useSessionGuard();

    const { projectNames, error: projectsError } = getProjects(sessionReady);
    const [selectedProject, setSelectedProject] = useState('');

    const { trackerOptions, error: trackerError } = getTrackers(selectedProject);
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const { items: trackerItems, error: itemsError, reload } = getTrackerItems(selectedTrackerId);
    const [selectedTrackerItems, setSelectedTrackerItems] = useState([]);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();

    const handleSelectAll = () => {
        if (selectedTrackerItems.length === trackerItems.length) {
            setSelectedTrackerItems([]); // Deselect all
        } else {
            setSelectedTrackerItems(trackerItems.map(item => item.id)); // Select all
        }
    };

    const handleItemToggle = (id) => {
        setSelectedTrackerItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const updateMetadata = async () => {
        const res = await fetch(`${API_BASE_URL}/api/update_item_metadata`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tracker_id: selectedTrackerId,
                project_name: selectedProject,
                item_id_list: selectedTrackerItems,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to update metadata');
        return data?.detail || 'Metadata was updated successfully.';
    };

    return (
        <div>
            <h1>Update Item Metadata</h1>
            <p>
                Randomly update fields for items in the selected tracker.
                Fields updated include: Type (excluding "Folder" and "Information"),
                Complexity, Story Points (1–10), Business Value, Priority, and
                Assigned to. The "Assigned to" field will randomly select from users
                in the project—ensure multiple users are present for varied assignments.
            </p>
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h4>Project</h4>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
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
                            <select value={selectedTrackerId} onChange={(e) => {
                                const trackerId = e.target.value;
                                setSelectedTrackerId(trackerId);
                            }}>
                                <option value="">Select a tracker</option>
                                {trackerOptions.map((tracker) => (
                                    <option key={tracker.id} value={tracker.id}>
                                        {tracker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                {/* Tracker Items Selection */}
                {trackerItems.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4>Select Tracker Items</h4>
                        <select multiple style={{ width: '250px', height: '150px' }}>
                            <option onClick={handleSelectAll}>
                                {selectedTrackerItems.length === trackerItems.length ? 'Deselect All' : 'Select All'}
                            </option>
                            {trackerItems.map(item => (
                                <option
                                    key={item.id}
                                    onClick={() => handleItemToggle(item.id)}
                                    style={{
                                        backgroundColor: selectedTrackerItems.includes(item.id) ? '#5bb73b' : 'white',
                                        color: selectedTrackerItems.includes(item.id) ? 'white' : 'black'
                                    }}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div>
                <AsyncActionButton
                    isRunning={isRunning}
                    onRun={() => run(updateMetadata)}
                    label="Update"
                    busyLabel="Updating..."
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

export default UpdateItemMetadata;