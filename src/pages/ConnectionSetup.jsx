import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


function ConnectionSetup() {
    // create constants to get the data
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [productName, setProductName] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showConnectFailurePopup, setShowConnectFailurePopup] = useState(false);
    const [showProductPopup, setShowProductPopup] = useState(false);



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
            setShowSuccessPopup(true); // Show popup on success
        } catch (err) {
            console.error('Error connecting:', err);
            setIsConnected(false); 
            setResponseMessage(err.message);
            setShowConnectFailurePopup(true); // show popup notifying connection failure        
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
            setShowProductPopup(true); // Show popup on success
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

            <Popup open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} modal>
                <div style={{ padding: '1rem' }}>
                    <h3>✅ Connected Successfully!</h3>
                    <p>You are now connected to Codebeamer.</p>
                    <button onClick={() => setShowSuccessPopup(false)}>Close</button>
                </div>
            </Popup>

            <Popup open={showConnectFailurePopup} onClose={() => setShowConnectFailurePopup(false)} modal>
                <div style={{ padding: '1rem' }}>
                    <h3>‼️ Failure to Connect</h3>
                    <p>Check credentials and try again to connect to Codebeamer</p>
                    <button onClick={() => setShowConnectFailurePopup(false)}>Close</button>
                </div>
            </Popup>

            <Popup open={showProductPopup} onClose={() => setShowProductPopup(false)} modal>
                <div style={{ padding: '1rem' }}>
                    <h3>✅ Product Set Successfully!</h3>
                    <p>The product <strong>{productName}</strong> has been configured.</p>
                    <button onClick={() => setShowProductPopup(false)}>Close</button>
                </div>
            </Popup>


        </div>
    )
}

export default ConnectionSetup;