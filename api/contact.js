import sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST')
		return res.status(405).json({ error: 'Method not allowed' });

	const { name, email, message, recaptcha } = req.body;

	// Verify reCAPTCHA
	const secret = process.env.RECAPTCHA_SECRET;
	const verify = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}`,
		{ method: 'POST' }
	);
	const captchaData = await verify.json();

	if (!captchaData.success)
		return res.status(400).json({ error: 'Failed reCAPTCHA verification' });

	try {
		const msg = {
			to: process.env.SENDGRID_SENDER_EMAIL,
			from: process.env.SENDGRID_SENDER_EMAIL,
			subject: `New contact form message from ${name}`,
			html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
		};

		await sgMail.send(msg);

		return res.status(200).json({ success: true });
	} catch (err) {
		console.error('SendGrid error:', err);
		return res.status(500).json({ error: 'Email sending failed' });
	}
}
