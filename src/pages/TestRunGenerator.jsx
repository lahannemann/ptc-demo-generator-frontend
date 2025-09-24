// import statements for later

function TestRunGenerator() {
    // add constants later

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
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Test Case Tracker</h4>
                    <select name="selectedTestCaseTracker">
                        <option></option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
            </div>
            <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Test Run Tracker</h4>
                    <select name="selectedTestRunTracker">
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

export default TestRunGenerator;