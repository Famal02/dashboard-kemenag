import React, { useState } from 'react';

function App() {
    const [myKey, setMyKey] = useState('');

    // Fungsi untuk meminta key baru dari backend
    const handleGenerate = async () => {
        try {
            const response = await fetch('http://localhost:5000/generate-key', {
                method: 'POST'
            });
            const data = await response.json();
            setMyKey(data.apiKey); // Simpan key yang didapat ke state
        } catch (error) {
            console.error("Gagal connect ke server 5000", error);
            alert("Gagal connect ke Server Backend (Port 5000). Pastikan 'node server.js' sudah jalan!");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>API Key Generator</h2>
            <button onClick={handleGenerate}>Klik untuk Generate API Key</button>

            {myKey && (
                <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>
                    <p>Kunci Anda (Simpan baik-baik):</p>
                    <code>{myKey}</code>
                </div>
            )}
        </div>
    );
}

export default App;
