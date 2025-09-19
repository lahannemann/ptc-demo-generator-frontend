// import statements later 

function GenerateItems() {
    // create constants to store data 

    // functions to update inputs

    return(
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
            <div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Requirement Type</h4>
                    <select name="selectedRequirementType">
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="both">Hardware & Sofware</option>
                    </select>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Tracker</h4>
                    <select>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Item Count</h4>
                    <input type="text" placeholder="Enter # of items"/>
                </div>
            </div>
            <button>Generate</button>
        </div>
    )
}

export default GenerateItems;