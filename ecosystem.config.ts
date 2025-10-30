// @ts-nocheck
module.exports = {
    apps: [
        {
            name: "http-backend",
            cwd: "./apps/http-backend",
            script: "pnpm",
            args: "start",

            watch: false,
            autorestart: true,
            max_memory_restart: "400M",
            log_date_format: "YYYY-MM-DD HH:mm Z"
        },
        {
            name: "frontend",
            cwd: "./apps/draw-frontend",
            script: "pnpm",
            args: "start",
            watch: false
        },
        {
            name: "ws-server",
            cwd: "./apps/ws-backend",
            script: "pnpm",
            args: "start",
            instances: 1,
            exec_mode: "fork"
        }
    ]
};

// events {}

// http {
//     server {
//         listen 80;
//         server_name 13.60.180.220;

//         # FRONTEND
//         location / {
//             proxy_pass http://localhost:3000;
//             proxy_http_version 1.1;
//             proxy_set_header Upgrade $http_upgrade;
//             proxy_set_header Connection "upgrade";
//             proxy_set_header Host $host;
//         }

//         # BACKEND API
//         location /api/ {
//             proxy_pass http://localhost:3030/;
//             proxy_http_version 1.1;
//             proxy_set_header Upgrade $http_upgrade;
//             proxy_set_header Connection "upgrade";
//             proxy_set_header Host $host;
//         }

//         # WEBSOCKET SERVER
//         location /ws/ {
//             proxy_pass http://localhost:8080/;
//             proxy_http_version 1.1;
//             proxy_set_header Upgrade $http_upgrade;
//             proxy_set_header Connection "upgrade";
//             proxy_set_header Host $host;
//         }
//     }
// }

