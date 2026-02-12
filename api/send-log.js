export default async function handler(req, res) {
    // Only allow POST requests from your website
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // This pulls the "hidden" URL you saved in Vercel's Environment Variables
    const webhookURL = process.env.DISCORD_URL;

    // Safety check if you forgot to set the variable in Vercel
    if (!webhookURL) {
        console.error("Missing DISCORD_URL environment variable.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorText = await response.text();
            console.error("Discord API Error:", errorText);
            return res.status(response.status).json({ error: 'Discord rejected the request.' });
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        return res.status(500).json({ error: 'Failed to connect to Discord.' });
    }
}
