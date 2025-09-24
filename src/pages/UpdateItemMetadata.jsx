// import statements here

function UpdateItemMetadata() {
    // constants to use later

    return (
        <div>
            <h1>Update Item Metadata</h1>
            <p>
                Randomly update fields for items in the selected tracker. 
                Fields updated include: Type (excluding "Folder" and "Information"), 
                Complexity, Story Points (1–10), Business Value, Priority, and 
                Assigned to. The "Assigned to" field will randomly select from users 
                in the project—ensure multiple users are present for varied assignments.
            </p>
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Tracker</h4>
                    <select name="selectedTracker">
                        <option></option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
            </div>
            <button>Generate</button>
        </div>
    )
}

export default UpdateItemMetadata;