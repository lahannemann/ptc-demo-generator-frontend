// import statements for later


function DeleteAllTrackerData() {
    // constants to be added later

    return (
        <div>
            <h1>Delete All Tracker Data</h1>
            <p>! WARNING: This task will delete ALL items in the selected tracker below</p>
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Tracker</h4>
                    <select>
                        <option></option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
            </div>
            <button>Delete Tracker Data</button>
        </div>
    )
}

export default DeleteAllTrackerData;