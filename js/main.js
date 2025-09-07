document.addEventListener('DOMContentLoaded', () => {
	// Mobile menu
	const btn = document.getElementById('menu-btn');
	const menu = document.getElementById('mobile-menu');
	if (btn && menu)
		btn.addEventListener('click', () => menu.classList.toggle('hidden'));

	// Hover circle
	const hoverLink = document.querySelector('a.group');
	const hoverCircle = document.getElementById('hover-circle');
	if (hoverLink && hoverCircle) {
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
	}

	// Contact form
	const form = document.getElementById('contactForm');
	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		if (typeof grecaptcha === 'undefined')
			return alert('reCAPTCHA failed to load.');

		const recaptcha = grecaptcha.getResponse();
		if (!recaptcha) return alert('Please verify you are not a robot.');

		const data = {
			name: form.name.value.trim(),
			email: form.email.value.trim(),
			message: form.message.value.trim(),
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
				alert('✅ Message sent successfully!');
				form.reset();
				grecaptcha.reset();
			} else {
				alert(`❌ ${result.error || 'Error sending message'}`);
			}
		} catch (err) {
			console.error('Form submission error:', err);
			alert('❌ Error sending message. Please try again later.');
		}
	});
});
