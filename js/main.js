const form = document.getElementById('contactForm');
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
	menu.classList.toggle('hidden');
	btn.classList.toggle('text-blue-600');
});

if (form) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const recaptcha = grecaptcha.getResponse();
		if (!recaptcha)
			return showBanner('errorBanner', 'Please verify you are not a robot.');

		const data = {
			name: form.name.value.trim(),
			email: form.email.value.trim(),
			phone: form.phone.value.trim(),
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
				form.reset();
				grecaptcha.reset();
				showBanner(
					'successBanner',
					' 😎 🙌 Message sent! We will reply back to you soon.'
				);
			} else {
				showBanner(
					'errorBanner',
					`😭 ${result.error || 'Error sending message'}`
				);
			}
		} catch (err) {
			console.error(err);
			showBanner(
				'errorBanner',
				'❌ Error sending message. Please try again later.'
			);
		}
	});
}

function showBanner(id, message) {
	const banner = document.getElementById(id);
	banner.querySelector('span').textContent = message;

	// Show with slide-up animation
	banner.classList.remove('hidden', 'translate-y-10', 'opacity-0');
	banner.classList.add('translate-y-0', 'opacity-100');

	// Auto-hide after 4 seconds
	setTimeout(() => {
		banner.classList.remove('translate-y-0', 'opacity-100');
		banner.classList.add('translate-y-10', 'opacity-0');
		setTimeout(() => banner.classList.add('hidden'), 500);
	}, 4000);
}

const swiper = new Swiper('.mySwiper', {
	slidesPerView: 1,
	spaceBetween: 20,
	loop: true,
	centeredSlides: true,
	autoplay: { delay: 3000, disableOnInteraction: false },
	pagination: { el: '.swiper-pagination', clickable: true },
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		640: { slidesPerView: 2 },
		1024: { slidesPerView: 3 },
	},
});
