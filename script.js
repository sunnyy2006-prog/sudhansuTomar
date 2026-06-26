// Theme toggle with persistence
(function(){
	const root = document.documentElement;
	const toggleBtn = document.getElementById('themeToggle');
	const stored = localStorage.getItem('theme');
	if(stored){
		root.setAttribute('data-theme', stored);
	}
	function updateIcon(){
		const mode = root.getAttribute('data-theme');
		if(!toggleBtn) return;
		toggleBtn.innerHTML = mode === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
	}
	updateIcon();
	if(toggleBtn){
		toggleBtn.addEventListener('click',()=>{
			const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
			root.setAttribute('data-theme', current);
			localStorage.setItem('theme', current);
			updateIcon();
		});
	}
})();

// 3D Particle Animation
(function(){
	const canvas = document.getElementById('particleCanvas');
	if(!canvas) return;
	
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	const particles = [];
	const particleCount = 80;
	
	class Particle{
		constructor(){
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.z = Math.random() * 1000;
			this.vx = (Math.random() - 0.5) * 0.5;
			this.vy = (Math.random() - 0.5) * 0.5;
			this.vz = (Math.random() - 0.5) * 2;
			this.size = Math.random() * 3 + 1;
			this.color = `rgba(110,231,255,${Math.random() * 0.5 + 0.3})`;
		}
		
		update(){
			this.x += this.vx;
			this.y += this.vy;
			this.z += this.vz;
			
			if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
			if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
			if(this.z < 0 || this.z > 1000) this.vz *= -1;
		}
		
		draw(){
			const depth = Math.max(1, 1000 - this.z);
			const scale = 1000 / depth;
			const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
			const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
			const size2d = this.size * scale;
			if(!Number.isFinite(size2d) || size2d <= 0) return;
			
			ctx.beginPath();
			ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.fill();
			
			// Glow effect
			ctx.shadowBlur = 10;
			ctx.shadowColor = this.color;
		}
	}
	
	for(let i = 0; i < particleCount; i++){
		particles.push(new Particle());
	}
	
	function animate(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Draw connections
		particles.forEach((p1, i) => {
			particles.slice(i + 1).forEach(p2 => {
				const dx = p1.x - p2.x;
				const dy = p1.y - p2.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				
				if(distance < 150){
					ctx.beginPath();
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.strokeStyle = `rgba(110,231,255,${0.2 * (1 - distance / 150)})`;
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
			});
		});
		
		particles.forEach(particle => {
			particle.update();
			particle.draw();
		});
		
		requestAnimationFrame(animate);
	}
	
	animate();
	
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
})();

// Scroll reveal
(function(){
	const observer = new IntersectionObserver((entries)=>{
		for(const entry of entries){
			if(entry.isIntersecting){
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		}
	},{threshold:0.12});
	for(const el of document.querySelectorAll('.reveal')){
		observer.observe(el);
	}
})();

// Mouse move 3D effect

(function(){
	document.addEventListener('mousemove', (e)=>{
		const cards = document.querySelectorAll('.card');
		cards.forEach(card=>{
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const rotateX = (y - centerY) / 20;
			const rotateY = (centerX - x) / 20;
			
			card.addEventListener('mouseenter', ()=>{
				card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
			});
			
			card.addEventListener('mouseleave', ()=>{
				card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
			});
		});
	});
})();

// Contact form with Formspree
(function(){
	const form = document.getElementById('contactForm');
	const status = document.getElementById('formStatus');
	const year = document.getElementById('year');
	if(year){year.textContent = new Date().getFullYear();}
	if(!form || !status) return;
	
	form.addEventListener('submit', async (e)=>{
		e.preventDefault();
		const data = new FormData(form);
		
		if(!data.get('name') || !data.get('email') || !data.get('message')){
			status.textContent = 'Please fill out all fields.';
			status.style.color = '#ef4444';
			status.hidden = false;
			return;
		}
		
		status.textContent = 'Sending...';
		status.style.color = 'var(--muted)';
		status.hidden = false;
		
		try{
			const response = await fetch(form.action, {
				method: 'POST',
				body: data,
				headers: {
					'Accept': 'application/json'
				}
			});
			
			if(response.ok){
				status.textContent = '✅ Thanks! Your message has been sent successfully. I\'ll get back to you soon!';
				status.style.color = '#22c55e';
				form.reset();
			} else {
				throw new Error('Form submission failed');
			}
		} catch(error){
			status.textContent = '❌ Oops! There was a problem sending your message. Please try again or email me directly.';
			status.style.color = '#ef4444';
		}
		
		status.hidden = false;
	});
})();


