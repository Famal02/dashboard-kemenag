const axios = require('axios');

const URL = "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penyaluran";
const API_KEY = "prod-b533376f-f659-42c3-af49-92b03d468cf1"; // Trying the key we have
const fs = require('fs');

async function inspectApi() {
    try {
        let output = `Analysis of ${URL}\n\n`;
        console.log(`Fetching from: ${URL}`);
        const response = await axios.get(URL, {
            headers: {
                "x-api-key": API_KEY
            }
        });

        const data = response.data;
        output += `✅ API Response Status: ${response.status}\n`;
        output += `✅ Data Type: ${typeof data}\n`;

        if (data && data.data) {
            const innerData = data.data;

            if (Array.isArray(innerData)) {
                output += `✅ 'data' is an Array with ${innerData.length} items.\n`;
                if (innerData.length > 0) {
                    output += "\n📦 Sample Item Structure:\n";
                    output += JSON.stringify(innerData[0], null, 2);
                    output += `\n\n🔑 All Keys in First Item:\n${Object.keys(innerData[0]).join(", ")}\n`;
                }
            } else if (innerData.items && Array.isArray(innerData.items)) {
                output += `✅ 'data.items' is an Array with ${innerData.items.length} items.\n`;
                if (innerData.items.length > 0) {
                    output += "\n📦 Sample Item Structure (from data.items):\n";
                    output += JSON.stringify(innerData.items[0], null, 2);
                    output += `\n\n🔑 Keys:\n${Object.keys(innerData.items[0]).join(", ")}\n`;
                }
            } else {
                output += `\n📦 Data Structure:\n${JSON.stringify(innerData, null, 2)}\n`;
            }
        } else {
            output += `\n📦 Raw Data:\n${JSON.stringify(data, null, 2)}\n`;
        }

        fs.writeFileSync('debug_api_output.txt', output);
        console.log("✅ Output saved to debug_api_output.txt");

    } catch (error) {
        console.error("❌ Error fetching API:");
        console.error(error);
    }
}

inspectApi();
