import express from 'express';
const router = express.Router();

router.get("/conversations",(req, res) => {
    res.send("Hello from conversation route")
});

export default router;