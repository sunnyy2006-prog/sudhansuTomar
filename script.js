// ========================================================
// THEME TOGGLE WITH LOCALSTORAGE PERSISTENCE
// ========================================================
(function initTheme(){
	const root = document.documentElement;
	const toggleBtn = document.getElementById('themeToggle');
	const stored = localStorage.getItem('theme') || 'dark';
	
	root.setAttribute('data-theme', stored);
	
	function updateIcon(){
		const mode = root.getAttribute('data-theme');
		if(!toggleBtn) return;
		toggleBtn.innerHTML = mode === 'light' 
			? '<i class="fa-solid fa-moon"></i>' 
			: '<i class="fa-solid fa-sun"></i>';
	}
	
	updateIcon();
	
	if(toggleBtn){
		toggleBtn.addEventListener('click', () => {
			const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
			root.setAttribute('data-theme', current);
			localStorage.setItem('theme', current);
			updateIcon();
		});
	}
})();

// ========================================================
// COOL CUSTOM INTERACTIVE CURSOR (BULLETPROOF & GPU-ACCELERATED)
// ========================================================
(function initCoolCursor(){
	const dot = document.getElementById('cursor-dot');
	const ring = document.getElementById('cursor-ring');
	const trailContainer = document.getElementById('cursor-trail');
	if(!dot || !ring) return;

	let mouseX = -200;
	let mouseY = -200;
	let dotX = -200;
	let dotY = -200;
	let ringX = -200;
	let ringY = -200;
	let prevX = 0;
	let prevY = 0;
	let isHovered = false;
	let isMouseDown = false;
	let hasMoved = false;

	// Mouse Move tracking
	window.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		if(!hasMoved){
			hasMoved = true;
			dotX = mouseX;
			dotY = mouseY;
			ringX = mouseX;
			ringY = mouseY;
			dot.style.opacity = '1';
			ring.style.opacity = '1';
		}

		// Calculate speed for spark emitter
		const dx = mouseX - prevX;
		const dy = mouseY - prevY;
		const speed = Math.hypot(dx, dy);

		if(speed > 8 && Math.random() < 0.4){
			createSpark(mouseX, mouseY);
		}

		prevX = mouseX;
		prevY = mouseY;
	}, { passive: true });

	// Spark particle emitter
	function createSpark(x, y){
		if(!trailContainer) return;
		const spark = document.createElement('div');
		spark.className = 'cursor-spark';
		const size = Math.random() * 4 + 3;
		spark.style.width = `${size}px`;
		spark.style.height = `${size}px`;
		const offsetX = (Math.random() - 0.5) * 10;
		const offsetY = (Math.random() - 0.5) * 10;
		spark.style.left = `${x + offsetX}px`;
		spark.style.top = `${y + offsetY}px`;
		trailContainer.appendChild(spark);

		setTimeout(() => {
			spark.remove();
		}, 480);
	}

	// Click shockwave
	window.addEventListener('mousedown', (e) => {
		isMouseDown = true;
		ring.classList.add('active');
	});

	window.addEventListener('mouseup', (e) => {
		isMouseDown = false;
		ring.classList.remove('active');

		// Create expanding shockwave ripple
		const shockwave = document.createElement('div');
		shockwave.className = 'cursor-shockwave';
		shockwave.style.left = `${e.clientX}px`;
		shockwave.style.top = `${e.clientY}px`;
		document.body.appendChild(shockwave);

		setTimeout(() => {
			shockwave.remove();
		}, 520);
	});

	// Window Leave / Enter
	document.addEventListener('mouseleave', () => {
		dot.style.opacity = '0';
		ring.style.opacity = '0';
	});

	document.addEventListener('mouseenter', () => {
		dot.style.opacity = '1';
		ring.style.opacity = '1';
	});

	// Event Delegation for hover states (never misses any element)
	document.addEventListener('mouseover', (e) => {
		const target = e.target.closest('a, button, .btn, .card, .connect-card, .skill-pill, .stat-card, .floating-pill, input, textarea, [role="button"]');
		if(target){
			isHovered = true;
			ring.classList.add('hovered');
		} else {
			isHovered = false;
			ring.classList.remove('hovered');
		}
	}, { passive: true });

	// Smooth Lerp Animation Loop (60-120 FPS via translate3d)
	function renderCursor(){
		if(hasMoved){
			// Dot snaps closely to cursor
			dotX += (mouseX - dotX) * 0.85;
			dotY += (mouseY - dotY) * 0.85;
			const dotScale = isHovered ? 1.5 : 1;
			dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;

			// Ring follows with silky fluid spring inertia
			ringX += (mouseX - ringX) * 0.18;
			ringY += (mouseY - ringY) * 0.18;
			const ringScale = isMouseDown ? 0.75 : 1;
			ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
		}

		requestAnimationFrame(renderCursor);
	}

	requestAnimationFrame(renderCursor);
})();

// ========================================================
// DYNAMIC HERO ROLE TYPIST (TERMINAL EFFECT)
// ========================================================
(function initRoleTypist(){
	const roleEl = document.getElementById('roleTyped');
	if(!roleEl) return;

	const roles = [
		'Full Stack Developer',
		'AI & ML Explorer',
		'C++ & Python Problem Solver',
		'Software Engineering Enthusiast',
		'CSE Undergraduate @ LIET'
	];

	let roleIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	let typingDelay = 90;

	function typeRole(){
		const currentRole = roles[roleIndex];

		if(isDeleting){
			roleEl.textContent = currentRole.substring(0, charIndex - 1);
			charIndex--;
			typingDelay = 45;
		} else {
			roleEl.textContent = currentRole.substring(0, charIndex + 1);
			charIndex++;
			typingDelay = 95;
		}

		if(!isDeleting && charIndex === currentRole.length){
			// Pause before deleting
			typingDelay = 2200;
			isDeleting = true;
		} else if(isDeleting && charIndex === 0){
			isDeleting = false;
			roleIndex = (roleIndex + 1) % roles.length;
			typingDelay = 400;
		}

		setTimeout(typeRole, typingDelay);
	}

	setTimeout(typeRole, 600);
})();

// ========================================================
// MOUSE-REACTIVE PARTICLE UNIVERSE CANVAS
// ========================================================
(function initParticleCanvas(){
	const canvas = document.getElementById('particleCanvas');
	if(!canvas) return;

	const ctx = canvas.getContext('2d');
	let width = (canvas.width = window.innerWidth);
	let height = (canvas.height = window.innerHeight);

	const particles = [];
	const particleCount = Math.min(85, Math.floor(window.innerWidth / 16));

	let mouseX = -1000;
	let mouseY = -1000;

	window.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	window.addEventListener('mouseleave', () => {
		mouseX = -1000;
		mouseY = -1000;
	});

	class Particle{
		constructor(){
			this.x = Math.random() * width;
			this.y = Math.random() * height;
			this.z = Math.random() * 800;
			this.vx = (Math.random() - 0.5) * 0.6;
			this.vy = (Math.random() - 0.5) * 0.6;
			this.vz = (Math.random() - 0.5) * 1.5;
			this.baseSize = Math.random() * 2.5 + 1.2;
			this.isCyan = Math.random() > 0.4;
		}

		update(){
			this.x += this.vx;
			this.y += this.vy;
			this.z += this.vz;

			// Boundary wrap
			if(this.x < 0) this.x = width;
			if(this.x > width) this.x = 0;
			if(this.y < 0) this.y = height;
			if(this.y > height) this.y = 0;
			if(this.z < 0) this.z = 800;
			if(this.z > 800) this.z = 0;

			// Mouse repulsion physics
			const dx = this.x - mouseX;
			const dy = this.y - mouseY;
			const dist = Math.hypot(dx, dy);
			if(dist < 70 && dist > 0){
				const force = (70 - dist) / 70;
				this.x += (dx / dist) * force * 3;
				this.y += (dy / dist) * force * 3;
			}
		}

		draw(){
			const depth = Math.max(1, 800 - this.z);
			const scale = 800 / depth;
			const x2d = (this.x - width / 2) * scale + width / 2;
			const y2d = (this.y - height / 2) * scale + height / 2;
			const size2d = this.baseSize * scale;

			if(!Number.isFinite(size2d) || size2d <= 0) return;

			ctx.beginPath();
			ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
			const alpha = Math.min(0.85, (1 - this.z / 800) * 0.7 + 0.2);
			ctx.fillStyle = this.isCyan 
				? `rgba(56, 189, 248, ${alpha})` 
				: `rgba(168, 85, 247, ${alpha})`;
			ctx.fill();
		}
	}

	for(let i = 0; i < particleCount; i++){
		particles.push(new Particle());
	}

	function animate(){
		ctx.clearRect(0, 0, width, height);

		// Inter-particle laser connections
		for(let i = 0; i < particles.length; i++){
			const p1 = particles[i];
			for(let j = i + 1; j < particles.length; j++){
				const p2 = particles[j];
				const dx = p1.x - p2.x;
				const dy = p1.y - p2.y;
				const dist = Math.hypot(dx, dy);

				if(dist < 130){
					ctx.beginPath();
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(p2.x, p2.y);
					const alpha = (1 - dist / 130) * 0.18;
					ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
					ctx.lineWidth = 0.6;
					ctx.stroke();
				}
			}

			// Laser connection to Cursor
			const mouseDist = Math.hypot(p1.x - mouseX, p1.y - mouseY);
			if(mouseDist < 160){
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(mouseX, mouseY);
				const laserAlpha = (1 - mouseDist / 160) * 0.35;
				ctx.strokeStyle = `rgba(168, 85, 247, ${laserAlpha})`;
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		}

		particles.forEach(p => {
			p.update();
			p.draw();
		});

		requestAnimationFrame(animate);
	}

	animate();

	window.addEventListener('resize', () => {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	});
})();

// ========================================================
// CURSOR-FOLLOWING SPOTLIGHT ON CARDS
// ========================================================
(function initSpotlightCards(){
	const cards = document.querySelectorAll('.card, .connect-card, .stat-card');
	cards.forEach(card => {
		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			card.style.setProperty('--mouse-x', `${x}px`);
			card.style.setProperty('--mouse-y', `${y}px`);
		});
	});
})();

// ========================================================
// 3D PERSPECTIVE TILT ON PORTRAIT
// ========================================================
(function initPortraitTilt(){
	const hero = document.querySelector('.hero');
	const portraitCard = document.getElementById('portraitCard');
	if(!hero || !portraitCard) return;

	hero.addEventListener('mousemove', (e) => {
		const rect = hero.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateY = ((x - centerX) / centerX) * 12;
		const rotateX = -((y - centerY) / centerY) * 12;

		portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	});

	hero.addEventListener('mouseleave', () => {
		portraitCard.style.transform = 'perspective(1000px) rotateX(4deg) rotateY(-6deg)';
	});
})();

// ========================================================
// SCROLL REVEAL & NAVIGATION SCROLLSPY
// ========================================================
(function initScrollEffects(){
	// Reveal on scroll
	const reveals = document.querySelectorAll('.reveal');
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });

	reveals.forEach(el => observer.observe(el));

	// Nav scrollspy
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav-link');

	window.addEventListener('scroll', () => {
		let current = '';
		const scrollPos = window.scrollY + 140;

		sections.forEach(section => {
			const top = section.offsetTop;
			const height = section.offsetHeight;
			if(scrollPos >= top && scrollPos < top + height){
				current = section.getAttribute('id');
			}
		});

		navLinks.forEach(link => {
			link.classList.remove('active');
			if(link.getAttribute('href') === `#${current}`){
				link.classList.add('active');
			}
		});
	});

	// Back to top button
	const backToTop = document.getElementById('backToTop');
	const yearSpan = document.getElementById('year');
	if(yearSpan) yearSpan.textContent = new Date().getFullYear();

	if(backToTop){
		window.addEventListener('scroll', () => {
			if(window.scrollY > 350){
				backToTop.classList.add('visible');
			} else {
				backToTop.classList.remove('visible');
			}
		});

		backToTop.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}
})();

// ========================================================
// FORMSPREE CONTACT FORM SUBMISSION
// ========================================================
(function initContactForm(){
	const form = document.getElementById('contactForm');
	const status = document.getElementById('formStatus');
	if(!form || !status) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const data = new FormData(form);

		status.textContent = 'Sending message...';
		status.style.color = 'var(--text-secondary)';
		status.hidden = false;

		try{
			const response = await fetch(form.action, {
				method: 'POST',
				body: data,
				headers: { 'Accept': 'application/json' }
			});

			if(response.ok){
				status.textContent = '✅ Thank you! Your message has been sent successfully. I will get back to you soon!';
				status.style.color = '#22c55e';
				form.reset();
			} else {
				throw new Error('Form submission failed');
			}
		} catch(error){
			status.textContent = '❌ Unable to send message right now. Please email directly at stomar532006@gmail.com.';
			status.style.color = '#ef4444';
		}
	});
})();
