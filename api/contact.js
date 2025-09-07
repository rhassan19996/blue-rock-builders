// ESM syntax for Node.js 18+ on Vercel
import fetch from 'node-fetch';
import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { name, email, message, recaptcha } = req.body;
		console.log('📨 Incoming request:', { name, email, message, recaptcha });

		// Check required environment variables
		const {
			RECAPTCHA_SECRET,
			EMAILJS_SERVICE,
			EMAILJS_TEMPLATE,
			EMAILJS_PUBLIC,
			EMAILJS_PRIVATE,
		} = process.env;
		if (
			!RECAPTCHA_SECRET ||
			!EMAILJS_SERVICE ||
			!EMAILJS_TEMPLATE ||
			!EMAILJS_PUBLIC ||
			!EMAILJS_PRIVATE
		) {
			console.error('❌ Missing one or more environment variables');
			return res.status(500).json({ error: 'Server configuration error' });
		}

		// Verify reCAPTCHA
		const verifyResponse = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptcha}`,
			{ method: 'POST' }
		);
		const captchaData = await verifyResponse.json();
		console.log('🔎 Captcha result:', captchaData);

		if (!captchaData.success) {
			return res.status(400).json({ error: 'Failed reCAPTCHA verification' });
		}

		// Send email via EmailJS
		await emailjs.send(
			EMAILJS_SERVICE,
			EMAILJS_TEMPLATE,
			{
				title: `Message from ${name}`, // Subject placeholder
				name, // {{name}}
				email, // {{email}}
				message, // {{message}}
				time: new Date().toLocaleString(), // {{time}}
			},
			{
				publicKey: EMAILJS_PUBLIC,
				privateKey: EMAILJS_PRIVATE,
			}
		);

		console.log('✅ Email sent successfully!');
		return res.status(200).json({ success: true });
	} catch (err) {
		console.error('❌ Function crashed:', err);
		return res.status(500).json({ error: 'Email sending failed' });
	}
}
try {
	const response = await emailjs.send(
		process.env.EMAILJS_SERVICE,
		process.env.EMAILJS_TEMPLATE,
		{
			title: `Message from ${name}`,
			name,
			email,
			message,
			time: new Date().toLocaleString(),
		},
		{
			publicKey: process.env.EMAILJS_PUBLIC,
			privateKey: process.env.EMAILJS_PRIVATE,
		}
	);

	console.log('✅ EmailJS response:', response);
	return res.status(200).json({ success: true });
} catch (err) {
	console.error('❌ EmailJS error:', err);
	return res.status(500).json({ error: 'Email sending failed' });
}
