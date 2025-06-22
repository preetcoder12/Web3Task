const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running.\n');
});

const wss = new WebSocket.Server({ server });

let animationInterval = null;
let animationProgress = 0;
let animationClients = new Set();

function generateAnimationData() {
    animationProgress += 2;
    if (animationProgress > 100) {
        animationProgress = 100;
    }
    return { progress: animationProgress };
}

function startSendingAnimationData() {
    if (!animationInterval) {
        animationProgress = 0;
        animationInterval = setInterval(() => {
            const data = generateAnimationData();
            const message = JSON.stringify(data);
            animationClients.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(message);
                }
            });
        }, 50);
        console.log('Started sending animation progress.');
    }
}

function stopSendingAnimationData() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        animationProgress = 0;
        console.log('Stopped sending animation progress.');
    }
}

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'Animation->Start :)....') {
                animationClients.add(ws);
                startSendingAnimationData();
            } else if (parsedMessage.type === 'Animation->Stop....') {
                animationClients.delete(ws);
                if (animationClients.size === 0) {
                    stopSendingAnimationData();
                }
            }
        } catch (e) {
            console.error('Failed to parse message:', message, e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        animationClients.delete(ws);
        if (animationClients.size === 0) {
            stopSendingAnimationData();
        }
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
        animationClients.delete(ws);
        if (animationClients.size === 0) {
            stopSendingAnimationData();
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server listening on port ${PORT}`);
});