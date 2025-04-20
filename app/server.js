const express = require('express');
const noblox = require('noblox.js');
const app = express();
const port = process.env.PORT || 3000; // Use Glitch's port or default to 3000

// Middleware to parse JSON bodies (if you plan to send data)
app.use(express.json());

// Replace with your group ID
const groupId = 14290811;
// Store your bot's cookie securely
let COOKIE = process.env.ROBLOX_COOKIE;

async function setRobloxRank(userId, rankId) {
    if (!COOKIE) {
        console.warn("Roblox cookie not set. Cannot perform actions.");
        return false;
    }
    try {
        await noblox.setCookie(COOKIE);
        await noblox.setRank(groupId, userId, rankId);
        console.log(`Ranked user ${userId} to ${rankId}.`);
        return true;
    } catch (err) {
        console.error(`Error ranking user ${userId} to ${rankId}:`, err);
        return false;
    }
}

// Define a web endpoint for ranking a user
app.post('/rankUser', async (req, res) => {
    const userId = req.body.userId;
    const rankId = req.body.rankId;
    const requesterUserId = req.body.requesterUserId; // Optional: For logging/security

    if (!userId || !rankId) {
        return res.status(400).send('Missing userId or rankId in the request body.');
    }

    console.log(`Received rank request for user ${userId} to rank ${rankId} (requested by ${requesterUserId || 'unknown'}).`);

    const success = await setRobloxRank(userId, rankId);

    if (success) {
        res.status(200).send('User ranked successfully.');
    } else {
        res.status(500).send('Failed to rank user.');
    }
});

app.get('/', (req, res) => {
    res.send('Roblox Auto Ranker API is running!');
});

const listener = app.listen(port, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});