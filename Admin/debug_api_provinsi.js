const axios = require('axios');
const fs = require('fs');

const API_KEY = "prod-b533376f-f659-42c3-af49-92b03d468cf1";

const URLS = [
    { name: "Penerimaan Provinsi", url: "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penerimaan-provinsi" },
    { name: "Penyaluran Provinsi", url: "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penyaluran-prov" }
];

async function inspectApi() {
    let output = `Analysis of Provinsi APIs\n=========================\n\n`;

    for (const api of URLS) {
        try {
            console.log(`Fetching ${api.name}...`);
            output += `--- ${api.name} ---\nURL: ${api.url}\n`;

            const response = await axios.get(api.url, {
                headers: { "x-api-key": API_KEY }
            });

            const data = response.data;
            output += `✅ Status: ${response.status}\n`;

            let items = [];
            if (data && data.data) {
                if (Array.isArray(data.data)) {
                    items = data.data;
                } else if (data.data.items && Array.isArray(data.data.items)) {
                    items = data.data.items;
                }
            }

            output += `✅ Items Found: ${items.length}\n`;

            if (items.length > 0) {
                // Collect all province names
                const provinces = items.map(i => i.provinsi).sort();
                output += `\n📋 Found ${provinces.length} Provinces:\n${provinces.join(", ")}\n`;

                const sample = items[0];
                output += `\n📦 Sample Item Keys:\n${Object.keys(sample).join(", ")}\n`;
            } else {
                output += `\n⚠️ No items found or unknown structure.\nRaw Data: ${JSON.stringify(data, null, 2).substring(0, 500)}...\n`;
            }
            output += `\n\n`;

        } catch (error) {
            output += `❌ Error fetching ${api.name}: ${error.message}\n`;
            if (error.response) {
                output += `Status: ${error.response.status}\n`;
            }
            output += `\n\n`;
        }
    }

    fs.writeFileSync('debug_api_provinsi_output.txt', output);
    console.log("✅ Analysis complete. Check debug_api_provinsi_output.txt");
}

inspectApi();
