// import statements below

function BatchItemGenerator() {
    // constants to be added later
    const sessionReady = useSessionGuard();

    return (
        <div>
            <h1>Batch Item Generation</h1>
            <p>
                Generate up to thousands of items in a selected Codebeamer tracker without using AI. 
                Items are named sequentially using the format: "Tracker Name 1", "Tracker Name 2", 
                and so on. Ideal for quickly populating trackers with large volumes of placeholder 
                or test data.
            </p>
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Tracker</h4>
                    <select>
                        <option></option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
            </div>
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Item Count</h4>
                    <input type="number" name="itemCount"></input>
            </div>
            <button>Generate</button>
        </div>
    )
}

export default BatchItemGenerator;