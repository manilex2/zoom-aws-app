require("dotenv").config();
const express = require("express");
const http = require('http');
var compression = require('compression');
const app = express();
const { generateSignature } = require("./authentication/signature")
const path = require("path");
const cors = require("cors");
const serverHttp = http.createServer(app);

app.use(compression());
app.use(cors());

if (process.env.NODE_ENV == "production") {
    serverHttp.listen(process.env.HTTP_PORT, process.env.IP);
    serverHttp.on('listening', () => console.info(`Notes App running at http://${process.env.IP}:${process.env.HTTP_PORT}`));
} else {
    serverHttp.listen(8080, "localhost");
    serverHttp.on('listening', () => console.info(`Notes App running at http://localhost:8080`));
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("static", express.static("public"));

app.get(`/thanks`, (req, res) => {
    if (req.query.apiKey == process.env.API_KEY) {
        res.status(200).sendFile("/public/thanks.html", {root: __dirname});
    } else {
        res.status(403).json({
            error: "API Key Invalida",
            message: "Está intentando ir a una ruta protegida y necesita el API key correcto"
        });
    }
});

app.get(`/zoom-data/${process.env.API_KEY}/meetingId/:meetingId/name/:name/email/:email`, (req, res) => {
    const name = req.params['name'];
    const email = req.params['email'];
    const meetingId = req.params['meetingId'];
    const signature = generateSignature(process.env.SDK_KEY, process.env.SDK_SECRET, meetingId, process.env.MEETING_ROLE);
    res.json({
        sdkKey: process.env.SDK_KEY,
        signature: signature,
        meetingNumber: meetingId,
        password: process.env.MEETING_PWD,
        userName: name,
        role: process.env.MEETING_ROLE,
        email: email,
        lang: process.env.MEETING_LANG,
        china: "0"
    });
});

app.get(`/zoom-meeting`, (req, res) => {
    if (req.query.apiKey == process.env.API_KEY) {
        res.status(200).sendFile("/public/zoom.html", {root: __dirname});
    } else {
        res.status(403).json({
            error: "API Key Invalida",
            message: "El API Key que introdujo no es valido"
        });
    }
});

app.get('*', (req, res) => {
    res.status(200).json({
        error: "WRONG URL",
        message: "Ruta o API Key incorrecta"
    });
});