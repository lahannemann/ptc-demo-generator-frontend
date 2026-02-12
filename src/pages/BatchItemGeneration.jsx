import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function BatchItemGenerator() {
    // ensures the user is connected to codebeamer to access page
    const sessionReady = useSessionGuard();

    const [selectedProject, setSelectedProject] = useState('');
    const { projectNames, error: projectsError } = getProjects(sessionReady);

    const { trackerOptions, error: trackerError } = getTrackers(selectedProject);
    const [selectedTrackerName, setSelectedTrackerName] = useState('');
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const [itemCount, setItemCount] = useState('');
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();


    // handler: get id from value, name from selected option's text
    const handleTrackerSelect = (e) => {
        const id = e.target.value; // string
        const name =
            e.target.selectedOptions?.[0]?.text ||
            e.target.options[e.target.selectedIndex]?.text ||
            "";

        setSelectedTrackerId(id);
        setSelectedTrackerName(name);
    };


    const validateItemCount = async (e) => {
        const inputValue = e.target.value

        if (inputValue === '' || !isNaN(+inputValue)) {
            setError(''); // clears the error if input is empty or a valid number
            setItemCount(inputValue);
        } else {
            setError('Please enter a valid number');
        }
    };

    const generateBatchItems = async () => {
        const res = await fetch(`${API_BASE_URL}/api/generate_batch_items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tracker_id: selectedTrackerId,
                tracker_name: selectedTrackerName,
                item_count: itemCount,
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to generate tracker items');
        return data?.detail || 'Tracker items were generated successfully.';
    };

    return (
        <div>
            <h1>Batch Item Generation</h1>
            <p>
                Generate up to thousands of items in a selected Codebeamer tracker without using AI.
                Items are named sequentially using the format: "Tracker Name 1", "Tracker Name 2",
                and so on. Ideal for quickly populating trackers with large volumes of placeholder
                or test data.
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
                            <select value={selectedTrackerId} onChange={handleTrackerSelect}>
                            <option value="">Select a tracker</option>
                            {trackerOptions.map((t) => (
                                <option key={t.id} value={t.id}>
                                {t.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className='form-row'>
                            <h4>Item Count</h4>
                            <input
                                type="text"
                                placeholder="Enter # of items"
                                value={itemCount}
                                onChange={validateItemCount}
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <AsyncActionButton
                    isRunning={isRunning}
                    onRun={() => run(generateBatchItems)}
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
    );
}

export default BatchItemGenerator;