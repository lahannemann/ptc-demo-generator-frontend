// import statements for later
import React, { useState, useEffect } from 'react';
import useSessionGuard from "../hooks/useSessionGuard";

function GenerateTraceability() {
    const sessionReady = useSessionGuard();

    // useState or constants initialized later
    const [projectNames, setProjectNames] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedUpstreamProject, setSelectedUpstreamProject] = useState('');
    const [selectedDownstreamProject, setSelectedDownstreamProject] = useState('');
    const [upstreamTrackerOptions, setUpstreamTrackerOptions] = useState([]);
    const [downstreamTrackerOptions, setDownstreamTrackerOptions] = useState([]);
    const [upstreamSelectedTrackerId, setUpstreamSelectedTrackerId] = useState('');
    const [downstreamSelectedTrackerId, setDownstreamSelectedTrackerId] = useState('');
    const [itemCount, setItemCount] = useState('');
    const [upstreamTrackerItems, setUpstreamTrackerItems] = useState([]);
    const [selectedUpstreamItems, setSelectedUpstreamItems] = useState([])
    
    const [trackerItems, setTrackerItems] = useState([]);
    const [selectedTrackerItems, setSelectedTrackerItems] = useState([]);


    useEffect(() => {
        if (!sessionReady) return;
        const fetchProjectNames = async () => {
            try {
            const res = await fetch('http://localhost:8000/api/projects', {
                method: 'GET',
                credentials: 'include', // ensures session cookie is sent
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch project names');
            }

            const data = await res.json();
            setProjectNames(data.project_names || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setResponseMessage(err.message);
            }
        };

        fetchProjectNames();
    }, [sessionReady]);

    const handleUpstreamProjectSelect = async (e) => {
        const projectName = e.target.value;
        setSelectedUpstreamProject(projectName);

        try {
            const res = await fetch('http://localhost:8000/api/trackers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName }),
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch trackers');
            }

            const data = await res.json();
            setUpstreamTrackerOptions(data.trackers || []);
        } catch (err) {
            console.error('Error fetching trackers:', err);
            setResponseMessage(err.message);
        }
    };


    // Function to fetch items when user selects upstream tracker
    const fetchItemsForTracker = async (trackerId) => {
        if (!trackerId) return;

        try {
        const res = await fetch(`http://localhost:8000/api/tracker_items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tracker_id: trackerId }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Failed to fetch items');
        }
        
        const data = await res.json();
        setTrackerItems(data.tracker_items || []);
        setSelectedTrackerItems([]); // Reset selection when tracker changes
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

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

    const handleDownstreamProjectSelect = async (e) => {
        const projectName = e.target.value;
        setSelectedDownstreamProject(projectName);

        try {
            const res = await fetch('http://localhost:8000/api/trackers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName }),
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch trackers');
            }

            const data = await res.json();
            setDownstreamTrackerOptions(data.trackers || []);
        } catch (err) {
            console.error('Error fetching trackers:', err);
            setResponseMessage(err.message);
        }
    };

    const handleGenerate = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/generate_traceability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    upstream_tracker_id: upstreamSelectedTrackerId,
                    selected_tracker_items: trackerItems.filter(item => selectedTrackerItems.includes(item.id)),
                    downstream_tracker_id: downstreamSelectedTrackerId,
                    downstream_count: parseInt(itemCount),
                    additional_rules: '' // need to add a field for this
                })
            });

            const data = await res.json();
            setResponseMessage(data.message || 'Success');
        } catch (err) {
            console.error('Error generating items:', err);
            setResponseMessage('Failed to generate items');
        }
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
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Upstream Project</h4>
                    <select value={selectedUpstreamProject} onChange={handleUpstreamProjectSelect}>
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
                                    fetchItemsForTracker(trackerId); // ✅ Fetch items here
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
                {trackerItems.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4>Select Upstream Items</h4>
                        <select multiple style={{ width: '250px', height: '150px' }}>
                        <option onClick={handleSelectAll}>
                            {selectedTrackerItems.length === trackerItems.length ? 'Deselect All' : 'Select All'}
                        </option>
                        {trackerItems.map(item => (
                            <option
                                key={item.id}
                                onClick={() => handleItemToggle(item.id)}
                                style={{
                                    backgroundColor: selectedTrackerItems.includes(item.id) ? '#5bb73b' : 'white'
                                }}
                            >
                            {item.name}
                            </option>
                        ))}
                        </select>
                    </div>
                )}


                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Downstream Project</h4>
                    <select value={selectedDownstreamProject} onChange={handleDownstreamProjectSelect}>
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
                        <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
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
            <button onClick={handleGenerate}>Generate</button>
        
        </div>
    )
}

export default GenerateTraceability;