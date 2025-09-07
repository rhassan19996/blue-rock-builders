// sendTestEmail.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Make sure your API key is set

const msg = {
	to: 'rhassan19996@gmail.com', // Your personal email to receive test
	from: 'rhassan19996@gmail.com', // Must be a SendGrid verified sender
	subject: 'SendGrid Test Email',
	text: 'Hello! This is a test email from SendGrid using Node.js.',
	html: '<strong>Hello! This is a test email from SendGrid using Node.js.</strong>',
};

sgMail
	.send(msg)
	.then(() => console.log('✅ Email sent successfully!'))
	.catch((error) => console.error('❌ Error sending email:', error));
