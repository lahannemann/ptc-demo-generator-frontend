// import statements for later
import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';
import getTrackerItems from '../hooks/getTrackerItems';


import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function GenerateTraceability() {
    const sessionReady = useSessionGuard();

    // useState or constants initialized later
    const [selectedUpstreamProject, setSelectedUpstreamProject] = useState('');
    const [selectedDownstreamProject, setSelectedDownstreamProject] = useState('');
    const { trackerOptions: upstreamTrackerOptions, error: upstreamTrackerError } = getTrackers(selectedUpstreamProject);
    const { trackerOptions: downstreamTrackerOptions, error: downstreamTrackerError } = getTrackers(selectedDownstreamProject);
    const [upstreamSelectedTrackerId, setUpstreamSelectedTrackerId] = useState('');
    const [downstreamSelectedTrackerId, setDownstreamSelectedTrackerId] = useState('');
    const [itemCount, setItemCount] = useState('');

    const { projectNames, error: projectsError } = getProjects(sessionReady);

    const [selectedTrackerItems, setSelectedTrackerItems] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { items: upstreamTrackerItems, error: itemsError, reload } = getTrackerItems(upstreamSelectedTrackerId);

    // Clear any selected upstream items when the upstream tracker changes
    useEffect(() => {
        setSelectedTrackerItems([]);
    }, [upstreamSelectedTrackerId]);


    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();

    const handleSelectAll = () => {
        if (selectedTrackerItems.length === upstreamTrackerItems.length) {
            setSelectedTrackerItems([]); // Deselect all
        } else {
            setSelectedTrackerItems(upstreamTrackerItems.map(item => item.id)); // Select all
        }
    };

    const handleItemToggle = (id) => {
        setSelectedTrackerItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const generateItems = async () => {
        const res = await fetch(`${API_BASE_URL}/api/generate_traceability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                upstream_tracker_id: upstreamSelectedTrackerId,
                selected_tracker_items: upstreamTrackerItems.filter(item => selectedTrackerItems.includes(item.id)),
                downstream_tracker_id: downstreamSelectedTrackerId,
                downstream_count: parseInt(itemCount),
                additional_rules: '' // need to add a field for this
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to generate traceability');
        return data?.detail || 'Traceability was generated successfully.';
    };


    return (
        <div>
            <h1>Generate Traceability</h1>
            <p>Generate downstream items in a selected Codebeamer tracker based on upstream items.
                Choose an upstream tracker, then either select all items or pick specific ones to
                decompose. Define the downstream tracker and how many items to generate per upstream
                item. Make sure the downstream tracker’s built-in "subjects" field is configured to
                reference the selected upstream tracker. When you generate, AI creates related
                downstream items and links them to their corresponding upstream items in Codebeamer.
            </p>
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h4>Upstream Project</h4>
                    <select value={selectedUpstreamProject} onChange={(e) => setSelectedUpstreamProject(e.target.value)}>
                        <option value="">Select upstream project</option>
                        {projectNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                {upstreamTrackerOptions.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <h4>Upstream Tracker</h4>
                            <select value={upstreamSelectedTrackerId}
                                onChange={(e) => {
                                    const trackerId = e.target.value;
                                    setUpstreamSelectedTrackerId(trackerId);
                                }}>
                                <option value="">Select upstream tracker</option>
                                {upstreamTrackerOptions.map((tracker) => (
                                    <option key={tracker.id} value={tracker.id}>
                                        {tracker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Upstream Items Selection */}
                {upstreamTrackerItems.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4>Select Upstream Items</h4>
                        <select multiple style={{ width: '250px', height: '150px' }}>
                            <option onClick={handleSelectAll}>
                                {selectedTrackerItems.length === upstreamTrackerItems.length ? 'Deselect All' : 'Select All'}
                            </option>
                            {upstreamTrackerItems.map(item => (
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


                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h4>Downstream Project</h4>
                    <select value={selectedDownstreamProject} onChange={(e) => setSelectedDownstreamProject(e.target.value)}>
                        <option value="">Select downstream project</option>
                        {projectNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                {downstreamTrackerOptions.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <h4>Downstream Tracker</h4>
                            <select value={downstreamSelectedTrackerId} onChange={(e) => setDownstreamSelectedTrackerId(e.target.value)}>
                                <option value="">Select downstream tracker</option>
                                {downstreamTrackerOptions.map((tracker) => (
                                    <option key={tracker.id} value={tracker.id}>
                                        {tracker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <h4>Downstream Items per Upstream</h4>
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
                    busyLabel="Generating..."
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

export default GenerateTraceability;