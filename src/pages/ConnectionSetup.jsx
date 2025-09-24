// import statements here

function ConnectionSetup() {
    // create constants to get the data

    // get input from user typing later

    return (
        <div>
            <h1>Codebeamer Connection Setup</h1>
            <p>
                SECURITY NOTICE:  Please DO NOT use customer servers, usernames, 
                passwords, or any sensitive information when using this software.
                 This tool is designed for generating and loading demo data into 
                 cloud portals and other servers. For security reasons, always use 
                 test accounts and non-sensitive information.
            </p>
            <h2>Connect to Codebeamer</h2>
            <div >
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>URL</h4>
                    <input type="text" placeholder='Paste URL'/>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Username</h4>
                    <input type="text" placeholder="Enter username"/>
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Password</h4>
                    <input type="text" placeholder="Enter password"/>
                </div>
            </div>
            <button>Connect</button>
            {/* The below is to be shown after user makes connection to codebeamer
                Needs to be hidden or only appears after successful connection is made
            */ }
            <button>Disconnect</button>
            <h2>Select Project and Product</h2>
            <div>
                <div style={{display: "flex", alignItems:"center", gap:"1rem"}}>
                    <h4>Project</h4>
                    <select>
                        {/* will later need to be dependent on projects in the connected cb environment just a placeholder */}
                        <option></option>
                        <option>Project 1</option>
                        <option>Project 2</option>
                        <option>Project 3</option>
                    </select>
                </div>
                <div style={{display: "flex", alignItems:"center", gap:"1rem"}}>
                    <h4>Product</h4>
                    <input type="text" placeholder="Enter the product name"></input>
                </div>
            </div>
        </div>
    )
}

export default ConnectionSetup;