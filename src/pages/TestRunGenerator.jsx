import React, { useState, useEffect } from 'react';

import useSessionGuard from "../hooks/useSessionGuard";
import getProjects from '../hooks/getProjects';
import getTrackers from '../hooks/getTrackers';
import getTrackerItems from '../hooks/getTrackerItems';

import useAsyncPopupAction from '../hooks/useAsyncPopupAction';
import AsyncActionButton from '../components/AsyncActionButton';

function TestRunGenerator() {

    const sessionReady = useSessionGuard();

    const { projectNames, error: projectsError } = getProjects(sessionReady);
    const [selectedProject, setSelectedProject] = useState('');

    const { trackerOptions, error: trackerError } = getTrackers(selectedProject);
    const [selectedTrackerId, setSelectedTrackerId] = useState('');
    const { items: trackerItems, error: itemsError, reload } = getTrackerItems(selectedTrackerId);
    const [selectedTrackerItems, setSelectedTrackerItems] = useState([]);

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

    //slider management
    const totalSelected = selectedTrackerItems.length; // or trackerItems.length if you do "Select All"

    // distribution across outcomes
    const [resultDist, setResultDist] = useState({ passed: 0, failed: 0, blocked: 0 });

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    // Redistribute remaining counts across the other two categories,
    // preserving their relative proportions (and keeping integers).
    function redistribute(prev, key, newValue, total) {
        if (total <= 0) return { passed: 0, failed: 0, blocked: 0 };

        const keys = ["passed", "failed", "blocked"];
        const otherKeys = keys.filter(k => k !== key);

        const next = { ...prev };
        const v = clamp(Number(newValue) || 0, 0, total);
        next[key] = v;

        const remaining = total - v;

        const oldA = prev[otherKeys[0]];
        const oldB = prev[otherKeys[1]];
        const oldOthersTotal = oldA + oldB;

        // If the other two were zero, just put everything into the first other bucket
        if (oldOthersTotal === 0) {
            next[otherKeys[0]] = remaining;
            next[otherKeys[1]] = 0;
            return next;
        }

        // proportional split with integer rounding that sums exactly to remaining
        const rawA = (remaining * oldA) / oldOthersTotal;
        const rawB = (remaining * oldB) / oldOthersTotal;

        let a = Math.floor(rawA);
        let b = Math.floor(rawB);
        let leftover = remaining - (a + b);

        // assign leftover based on larger fractional part
        const fracA = rawA - a;
        const fracB = rawB - b;

        while (leftover > 0) {
            if (fracA >= fracB) a += 1;
            else b += 1;
            leftover -= 1;
        }

        next[otherKeys[0]] = a;
        next[otherKeys[1]] = b;

        return next;
    }

    useEffect(() => {
        const total = totalSelected;

        setResultDist(prev => {
            if (total <= 0) return { passed: 0, failed: 0, blocked: 0 };

            // If everything was zero, initialize to something sensible
            const sum = prev.passed + prev.failed + prev.blocked;
            if (sum === 0) return { passed: total, failed: 0, blocked: 0 };

            // Otherwise scale previous proportions to the new total
            const scaled = redistribute(prev, "passed", clamp(prev.passed, 0, total), total);
            // Note: redistribute already ensures sum == total for the selected key.
            return scaled;
        });
    }, [totalSelected]);


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // unified async action state (replaces local isGenerating/show*Popup/responseMessage)
    const {
        isRunning,
        run,
        responseMessage,
        showSuccessPopup, setShowSuccessPopup,
        showFailurePopup, setShowFailurePopup,
    } = useAsyncPopupAction();

    return (
        <div>
            <h1>Test Run Generator</h1>
            <p>
                Generate a single test run in a selected Test Run tracker using
                test cases from a specified Test Case tracker. Choose whether
                to include all test cases or only selected ones. Use sliders to
                define the percentage of test cases that should be marked as
                Passed, Failed, or Blocked.
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
                {totalSelected > 0 && (
                    <div style={{ marginTop: "1.25rem" }}>
                        <h4>Distribute results across {totalSelected} selected test cases</h4>

                        {(["passed", "failed", "blocked"]).map((k) => {
                            const label = k === "passed" ? "Items Passed"
                                : k === "failed" ? "Items Failed"
                                    : "Items Blocked";
                            const val = resultDist[k];
                            const pct = totalSelected ? Math.round((val / totalSelected) * 100) : 0;

                            return (
                                <div key={k} style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.75rem 0" }}>
                                    <div style={{ width: "140px" }}>{label}</div>

                                    <input
                                        type="range"
                                        min={0}
                                        max={totalSelected}
                                        step={1}
                                        value={val}
                                        onChange={(e) => {
                                            const newVal = Number(e.target.value);
                                            setResultDist(prev => redistribute(prev, k, newVal, totalSelected));
                                        }}
                                        style={{ width: "260px" }}
                                    />

                                    <input
                                        type="number"
                                        min={0}
                                        max={totalSelected}
                                        step={1}
                                        value={val}
                                        onChange={(e) => {
                                            const newVal = clamp(Number(e.target.value), 0, totalSelected);
                                            setResultDist(prev => redistribute(prev, k, newVal, totalSelected));
                                        }}
                                        style={{ width: "70px" }}
                                    />

                                    <div style={{ width: "55px", fontSize: "0.9rem", color: "#555" }}>
                                        {pct}%
                                    </div>
                                </div>
                            );
                        })}

                        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                            Total: {resultDist.passed + resultDist.failed + resultDist.blocked} / {totalSelected}
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

export default TestRunGenerator;