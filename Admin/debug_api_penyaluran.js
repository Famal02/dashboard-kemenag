const axios = require('axios');

async function testApi() {
    const url = "https://spl-core.devflocks.id/api/zakat/penyaluran_per_tahun";
    const apiKey = "prod-2cf350c4-cc0f-494a-af78-5685349627a7";

    try {
        console.log("Testing API:", url);
        const res = await axios.get(url, {
            headers: {
                "x-api-key": apiKey
            }
        });
        console.log("SUCCESS!");
        console.log("Status:", res.status);
        console.log("Data sample:", res.data.data.items ? res.data.data.items[0] : res.data);
    } catch (e) {
        console.error("FAILED!");
        console.error("Error Code:", e.code);
        console.error("Message:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", e.response.data);
        }
    }
}

testApi();
