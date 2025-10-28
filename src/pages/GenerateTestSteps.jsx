import useSessionGuard from "../hooks/useSessionGuard";

function GenerateTestSteps() {
    // constants to be added later
    const sessionReady = useSessionGuard();

    return (
        <div>
            <h1>Test Step Generator</h1>
            <p>
                Use AI to generate test steps for selected test cases in a specified 
                test case tracker. This task is intended for demo purposes and 
                should only be run on a small number of test cases. It generates 
                2 test steps per selected test case. Bulk generation is not supported
            </p>
            <p>
                !!! Please DO NOT generate test steps for more than 4 test cases per day, 
                as this process is resource-intensive and exceeding the limit may impact system performance.
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
            <button>Generate</button>
        </div>
    )
}

export default GenerateTestSteps;