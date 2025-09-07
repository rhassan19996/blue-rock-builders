import sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
	// Only accept POST requests
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, email, message, recaptcha } = req.body;

	if (!name || !email || !message || !recaptcha) {
		return res.status(400).json({ error: 'Missing fields' });
	}

	try {
		// 1️⃣ Verify reCAPTCHA
		const captchaRes = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptcha}`,
			{ method: 'POST' }
		);
		const captchaData = await captchaRes.json();

		if (!captchaData.success) {
			return res.status(400).json({ error: 'Failed reCAPTCHA verification' });
		}

		// 2️⃣ Send email via SendGrid
		await sgMail.send({
			to: process.env.CONTACT_TO_EMAIL,
			from: process.env.CONTACT_TO_EMAIL, // must be your verified sender
			subject: `Contact Form Message from ${name}`,
			text: `${message}\nFrom: ${name} <${email}>`,
			html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
		});

		// 3️⃣ Return success
		return res.status(200).json({ success: true });
	} catch (err) {
		console.error('Error sending email:', err);
		return res.status(500).json({ error: 'Email sending failed' });
	}
}
