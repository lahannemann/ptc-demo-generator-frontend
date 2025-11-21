import React, {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import useSessionGuard from "../hooks/useSessionGuard";

function UpdateItemStatuses() {
    const sessionReady = useSessionGuard();

    // constants to hold user selections and options
    const [projectNames, setProjectNames] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState('');
    const [trackerOptions, setTrackerOptions] = useState([]);
    const [selectedTrackerID, setSelectedTrackerID] = useState('');
    const [selectedTrackerName, setSelectedTrackerName] = useState('');
    const [selectedTrackerItems, setSelectedTrackerItems] = useState([]);

    const [responseMessage, setResponseMessage] = useState('');

    // for whether or not to show popups
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showFailurePopup, setShowFailurePopup] = useState(false);

    // fetches project options for user to choose from 
    useEffect(() => {
        // only does so if the codebeamer connection is set up 
        if (!sessionReady) return;
        const fetchProjects = async () => {
            try {
            const res = await fetch('http://localhost:8000/api/project_names', {
                method: 'GET',
                credentials: 'include', // ensures session cookie is sent
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to fetch projects');
            }

            const data = await res.json();
            setProjectNames(data.project_names || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setResponseMessage(err.message);
            }
        };

        fetchProjects();
    }, [sessionReady]);

    // fetches trackers after a project is selected to populate tracker options
    const handleProjectSelect = async (e) => {
        const projectName = e.target.value;
        setSelectedProjectName(projectName);

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
            setTrackerOptions(data.trackers || []);
        } catch (err) {
            console.error('Error fetching trackers:', err);
            setResponseMessage(err.message);
        }
    };

    // assigns selected tracker traits to pass on
    // initiates fetching items in selected tracker 
    const handleTrackerSelect = async (e) => {
        const trackerID = e.target.value;
        const trackerName = trackerOptions.find(t => String(t.id) === String(trackerID)).name; // gets tracker name from options stored using ID

        setSelectedTrackerID(trackerID);
        setSelectedTrackerName(trackerName);
        fetchItemsForTracker(trackerID);
    }

    // Function to fetch tracker items based on trackerID
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
            setSelectedTrackerItems(data.tracker_items || ["empty"]);
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

    const handleUpdateItemStatuses = async () => {
        const item_ids = selectedTrackerItems.map(item => item.id);
        try {
            const res = await fetch('http://localhost:8000/api/update_item_statuses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    tracker_id: selectedTrackerID,
                    item_id_list: item_ids,
                })
            });

            const data = await res.json();
            setResponseMessage(data.message);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error("Error updating item statuses: ", err);
            setResponseMessage('Error updating item statuses');
            setShowFailurePopup(true);
        }
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
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Project</h4>
                    <select value={selectedProjectName} onChange={handleProjectSelect}>
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
                            <select value={selectedTrackerID} onChange={handleTrackerSelect}>
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
            </div>
            <button onClick={handleUpdateItemStatuses}>Update</button>

            <Popup open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} modal>
                <div style={{ padding: '1rem' }}>
                    <h3>✅ Item Metadata Updated Successfully!</h3>
                    <p>Items in the {selectedTrackerName} tracker have been updated.</p>
                    <button onClick={() => setShowSuccessPopup(false)}>Close</button>
                </div>
            </Popup>

            <Popup open={showFailurePopup} onClose={() => setShowFailurePopup(false)} modal>
                <div style={{ padding: '1rem'}}>
                    <h3>‼️ Error Updating Item Metadata</h3>
                    <p>{responseMessage}</p>
                    <button onClick={() => setShowFailurePopup(false)}>Close</button>
                </div>
            </Popup>
        </div>
    )
}

export default UpdateItemStatuses;