import React, { useState, useEffect } from 'react';

import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';
import getTrackerItems from '../hooks/getTrackerItems';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function GenerateTestSteps() {
    // constants to be added later
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

    const MAX_SELECTIONS = 4;

    const handleItemToggleLimited = (id) => {
        setSelectedTrackerItems(prev => {
            const isSelected = prev.includes(id);
            if (isSelected) return prev.filter(x => x !== id);
            if (prev.length >= MAX_SELECTIONS) return prev; // enforce limit
            return [...prev, id];
        });
    };

    const generateTestSteps = async () => {
        const res = await fetch(`${API_BASE_URL}/api/generate_test_steps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tracker_id: selectedTrackerId,
                item_id_list: selectedTrackerItems,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to generate test steps');
        return data?.detail || 'Test steps were generated successfully.';
    };


    return (
        <div>
            <h1>Test Step Generator</h1>
            <p>
                Use AI to generate test steps for selected test cases in a specified
                test case tracker. This task is intended for demo purposes and
                should only be run on a small number of test cases. It generates
                2 test steps per selected test case. Bulk generation is not supported
            </p>
            <p>
                !!! Please DO NOT generate test steps for more than 4 test cases per day,
                as this process is resource-intensive and exceeding the limit may impact system performance.
            </p>
            <div>
                <div className='form-row'>
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
                        <div className='form-row'>
                            <h4>Tracker</h4>
                            <select value={selectedTrackerId} onChange={(e) => {
                                const trackerId = e.target.value;
                                setSelectedTrackerId(trackerId);
                            }}>
                                <option value="">Select Test Case tracker</option>
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
                    <div className="form-row form-row--multiselect">
                        <h4>Select Test Case Items (up to {MAX_SELECTIONS})</h4>

                        <select
                            multiple
                            value={selectedTrackerItems.map(String)} // controlled (array)
                            onChange={() => { /* no-op; selection handled via onMouseDown */ }}
                            style={{ width: '250px', height: '150px' }}
                        >
                            {trackerItems.map(item => {
                                const selected = selectedTrackerItems.includes(item.id);
                                const atLimit = selectedTrackerItems.length >= MAX_SELECTIONS;

                                return (
                                    <option
                                        key={item.id}
                                        value={String(item.id)}
                                        onMouseDown={(e) => {
                                            // Prevent native select behavior (which requires Ctrl/⌘)
                                            e.preventDefault();

                                            // If trying to add a 5th, ignore (or you can show a toast)
                                            if (!selected && atLimit) return;

                                            handleItemToggleLimited(item.id);
                                        }}
                                        style={{
                                            backgroundColor: selected ? '#5bb73b' : 'white',
                                            color: selected ? 'white' : 'black'
                                        }}
                                    >
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            {selectedTrackerItems.length}/{MAX_SELECTIONS} selected
                        </div>
                    </div>
                )}
            </div>
            <div>
                <AsyncActionButton
                    isRunning={isRunning}
                    onRun={() => run(generateTestSteps)}
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

export default GenerateTestSteps;