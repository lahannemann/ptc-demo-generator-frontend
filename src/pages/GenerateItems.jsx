// import statements later 
import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function GenerateItems() {
    const sessionReady = useSessionGuard();

    // data sources
    const { projectNames, error: projectsError } = getProjects(sessionReady);
    const [selectedProject, setSelectedProject] = useState('');
    const { trackerOptions, error: trackerError } = getTrackers(selectedProject);

    // form state
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const [selectedRequirementType, setSelectedRequirementType] = useState('hardware');
    const [itemCount, setItemCount] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();

    // page-specific API call
    const generateItems = async () => {
        const res = await fetch(`${API_BASE_URL}/api/generate_items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                requirement_type: selectedRequirementType,
                tracker_id: selectedTrackerId,
                item_count: parseInt(itemCount, 10),
                additional_rules: '',
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to generate items');
        return data?.detail || 'Items were generated successfully.';
    };


    return (
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
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h4>Requirement Type</h4>
                    <select value={selectedRequirementType} onChange={(e) => setSelectedRequirementType(e.target.value)}>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="both">Hardware & Software</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
            <div>
                <AsyncActionButton
                    isRunning={isRunning}
                    onRun={() => run(generateItems)}
                    label="Generate"
                    busyLabel="Generating…"
                    successOpen={showSuccessPopup}
                    onSuccessClose={() => setShowSuccessPopup(false)}
                    failureOpen={showFailurePopup}
                    onFailureClose={() => setShowFailurePopup(false)}
                    message={responseMessage}
                /></div>
        </div>
    )
}

export default GenerateItems;