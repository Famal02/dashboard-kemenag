const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://spl-core.devflocks.id',
            changeOrigin: true,
            logLevel: 'silent', // Menyembunyikan pesan pesan error proxy (ECONNRESET) di terminal
            onError: (err, req, res) => {
                // Mencegah error crash dan mengirim balik respon santun ke frontend
                if (!res.headersSent) {
                    res.writeHead(502, {
                        'Content-Type': 'application/json',
                    });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Proxy Target Unreachable",
                        detail: err.message
                    }));
                }
            }
        })
    );
    app.use(
        '/core',
        createProxyMiddleware({
            target: 'https://spl-satudata.kemenag.go.id',
            changeOrigin: true,
            secure: false
        })
    );
};
