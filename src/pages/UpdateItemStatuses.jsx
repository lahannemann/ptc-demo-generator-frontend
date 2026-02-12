import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';
import getTrackerItems from '../hooks/getTrackerItems';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function UpdateItemStatuses() {
    const sessionReady = useSessionGuard();

    // constants to hold user selections and options
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

    const updateStatuses = async () => {
        const res = await fetch(`${API_BASE_URL}/api/update_item_statuses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tracker_id: selectedTrackerId,
                item_id_list: selectedTrackerItems,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to update statuses');
        return data?.detail || 'Statuses were updated successfully.';
    };


    return (
        <div>
            <h1>Update Item Statuses</h1>
            <p>
                Automatically update the statuses of items in a selected Codebeamer
                tracker. For each item, the tool identifies all valid state
                transitions—including remaining in the current state—and randomly
                selects one. This process is applied to either all items in the
                tracker or only those you select.
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
                        <select multiple style={{ width: '500px', height: '250px' }}>
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
                    onRun={() => run(updateStatuses)}
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

export default UpdateItemStatuses;