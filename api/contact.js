// api/contact.js
import emailjs from '@emailjs/nodejs';
import fetch from 'node-fetch';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, email, message, recaptcha } = req.body;

	// ✅ Verify reCAPTCHA first
	const secret = process.env.RECAPTCHA_SECRET;
	const verify = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}`,
		{ method: 'POST' }
	);
	const captchaData = await verify.json();

	if (!captchaData.success) {
		return res.status(400).json({ error: 'Failed reCAPTCHA verification' });
	}

	try {
		// ✅ Send with EmailJS using template variables
		await emailjs.send(
			process.env.EMAILJS_SERVICE,
			process.env.EMAILJS_TEMPLATE,
			{
				title: `Message from ${name}`, // 👈 for subject: Contact Us: {{title}}
				name, // 👤 {{name}}
				email, // 📧 {{email}} (if you add it in template)
				message, // 💬 {{message}}
				time: new Date().toLocaleString(), // 🕒 {{time}}
			},
			{
				publicKey: process.env.EMAILJS_PUBLIC,
				privateKey: process.env.EMAILJS_PRIVATE,
			}
		);

		return res.status(200).json({ success: true });
	} catch (err) {
		console.error('❌ EmailJS Error:', err);
		return res.status(500).json({ error: 'Email sending failed' });
	}
}
