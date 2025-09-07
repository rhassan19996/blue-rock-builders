// /api/contact.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST')
		return res.status(405).json({ error: 'Method not allowed' });

	const { name, email, message } = req.body;

	// Verify reCAPTCHA
	try {
		const verifyRes = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptcha}`,
			{ method: 'POST' }
		);
		const captchaData = await verifyRes.json();

		if (!captchaData.success) {
			return res.status(400).json({ error: 'Failed reCAPTCHA verification' });
		}
	} catch (err) {
		console.error('reCAPTCHA error:', err);
		return res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
	}

	// Prepare the email
	const msg = {
		to: process.env.SENDGRID_VERIFIED_SENDER, // your email
		from: process.env.SENDGRID_VERIFIED_SENDER, // must be verified
		subject: `Contact Form Message from ${name}`,
		text: message,
		html: `<p><strong>${name}</strong> (${email}) sent:</p><p>${message}</p>`,
	};

	try {
		await sgMail.send(msg);
		res.status(200).json({ success: true });
	} catch (err) {
		console.error('❌ Error sending email:', err);
		res.status(500).json({ error: 'Email sending failed' });
	}
}
