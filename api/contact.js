// Using ESM syntax (make sure package.json has "type": "module")
import sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, email, message, recaptcha } = req.body;

	// 1️⃣ Verify reCAPTCHA
	try {
		const verify = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptcha}`,
			{ method: 'POST' }
		);

		const captchaData = await verify.json();
		if (!captchaData.success) {
			return res.status(400).json({ error: 'Failed reCAPTCHA verification' });
		}
	} catch (err) {
		console.error('reCAPTCHA verification error:', err);
		return res.status(500).json({ error: 'reCAPTCHA verification failed' });
	}

	// 2️⃣ Send email via SendGrid
	const msg = {
		to: process.env.CONTACT_RECEIVER_EMAIL, // Your email to receive messages
		from: process.env.CONTACT_SENDER_EMAIL, // Verified SendGrid sender
		subject: `Contact Form: ${name}`,
		text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
		html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
					 <p><strong>Phone:</strong> ${phone}</p>
           <p><strong>Message:</strong><br/>${message}</p>`,
	};

	try {
		await sgMail.send(msg);
		return res.status(200).json({ success: true });
	} catch (err) {
		console.error('SendGrid error:', err);
		return res.status(500).json({ error: 'Email sending failed' });
	}
}
