import express from "express";
import qrcode from "qrcode";

const router = express.Router();

router.get('/generate-qrcode', async (req, res) => {
    try {
        const serverUrl = `${req.protocol}://${req.headers.host}`;
        const qrCode = await qrcode.toDataURL(serverUrl)
        res.send(`<img src="${qrCode}" width=500 alt="QR Code"/>`)

    } catch (err) {
        console.log(err)
        res.status(500).send("Error generating QR code")
    }
})

export { router as qrRoute }
