// import statements here
import React, { useState } from 'react';


function ConnectionSetup() {
    // create constants to get the data
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [productName, setProductName] = useState('');


    // get input from user typing later
    const handleConnect = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url, username, password }),
            });
                
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Connection failed');
            }

            const data = await res.json();
            setIsConnected(true);
            setResponseMessage('');
        } catch (err) {
            console.error('Error connecting:', err);
            setIsConnected(false); 
            setResponseMessage(err.message);        
        }
    };
    
    const handleDisconnect = () => {
        setIsConnected(false);
        setResponseMessage('Disconnected.');
        setUrl('');
        setUsername('');
        setPassword('');
    };

    const handleSetProduct = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/set_product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ product_name: productName }),
            });

            if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Failed to set product');
            }

            const data = await res.json();
        } catch (err) {
            console.error('Error setting product:', err);
            setResponseMessage(err.message);
        }
    };

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
            {responseMessage && (
                <div
                    style={{
                    marginTop: '1rem',
                    }}
                >
                    {responseMessage}
                </div>
            )}
            <div >
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>URL</h4>
                    <input 
                        type="text" 
                        placeholder='Paste URL' 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                    />
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Username</h4>
                    <input 
                        type="text"
                        placeholder="Enter username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div style={{display: "flex", alignItems:"center", gap: "1rem"}}>
                    <h4>Password</h4>
                    <input 
                        type="password"
                        placeholder="Enter password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleConnect();
                            }
                        }}
                    />
                </div>
            </div>
            
            <button onClick={handleConnect}>
                {isConnected ? 'Connected ✅' : 'Connect'}
            </button>

        
            {isConnected && (
                <button onClick={handleDisconnect} style={{ marginTop: '1rem' }}>
                    Disconnect
                </button>
            )}
            
            {isConnected && (
                <>
                    <h2>Select Product</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <h4>Product</h4>
                        <input
                            type="text"
                            placeholder="Enter the product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSetProduct();
                                }
                            }}
                        />
                        <button onClick={handleSetProduct}>Set</button>
                    </div>
                </>
            )}

        </div>
    )
}

export default ConnectionSetup;