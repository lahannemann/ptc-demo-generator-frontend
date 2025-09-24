// import statements for later

function GenerateTraceability() {
    // useState or constants initialized later

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
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Upstream Tracker</h4>
                    <select name="selectedUpstreamTracker">
                        <option></option>
                        <option value="tracker1">Tracker 1</option>
                        <option value="tracker2">Tracker 2</option>
                        <option value="tracker3">Tracker 3</option>
                    </select>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Downstream Tracker</h4>
                    <select name="selectedUpstreamTracker">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Downstream Items per Upstream Item</h4>
                    <input type="number" placeholder="Enter # of items"/>
                </div>
            </div>
            <button>Generate</button>
        
        </div>
    )
}

export default GenerateTraceability;