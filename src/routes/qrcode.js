import express from "express";
import qrcode from "qrcode";

const router = express.Router();

router.get('/generate-qrcode', async (req, res) => {
    try {
        const serverUrl = `https://z7tl0djt-3000.euw.devtunnels.ms`
        const qrCode = await qrcode.toDataURL(serverUrl)
        res.send(`<img src="${qrCode}" width=500 alt="QR Code"/>`)

    } catch (err) {
        console.log(err)
        res.status(500).send("Error generating QR code")
    }
})

export { router as qrRoute }
