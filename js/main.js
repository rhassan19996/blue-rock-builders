// js/main.js
document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('menu-btn');
	const menu = document.getElementById('mobile-menu');

	btn.addEventListener('click', () => {
		menu.classList.toggle('hidden');
	});
});
// #For mouse hover on logo÷
const hoverLink = document.querySelector('a.group');
const hoverCircle = document.getElementById('hover-circle');

hoverLink.addEventListener('mousemove', (e) => {
	const rect = hoverLink.getBoundingClientRect();
	const x = e.clientX - rect.left - hoverCircle.offsetWidth / 2;
	const y = e.clientY - rect.top - hoverCircle.offsetHeight / 2;

	hoverCircle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
	hoverCircle.style.opacity = '0.3';
});

hoverLink.addEventListener('mouseleave', () => {
	hoverCircle.style.transform = 'scale(0)';
	hoverCircle.style.opacity = '0';
});

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contactForm');

	if (!form) return; // Exit if form doesn't exist

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Get reCAPTCHA response
		const recaptcha = grecaptcha.getResponse();
		if (!recaptcha) return alert('Please verify you are not a robot.');

		const data = {
			name: form.name.value,
			email: form.email.value,
			message: form.message.value,
			recaptcha,
		};

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (result.success) {
				alert('Message sent!');
				form.reset();
				grecaptcha.reset();
			} else {
				alert(result.error || 'Error sending message');
			}
		} catch (err) {
			console.error(err);
			alert('Error sending message');
		}
	});
});
