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
		if (!recaptcha) return alert('Please verify you are not a robot.');

		const data = {
			name: form.name.value.trim(),
			email: form.email.value.trim(),
			phone: form.phone.value.trim(), // added phone
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
			console.error(err);
			alert('❌ Error sending message. Please try again later.');
		}
	});
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
