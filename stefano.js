/* ================================================
   CANTON DELL'ARTE — JavaScript
   ================================================ */

   'use strict';

   /* ========== LOADER ========== */
   window.addEventListener('load', () => {
     const loader = document.getElementById('loader');
     if (!loader) return;
     setTimeout(() => {
       loader.classList.add('hidden');
       document.body.style.overflow = 'auto';
       // Trigger initial reveals
       checkReveals();
     }, 2200);
   });
   
   // Prevent scroll during load
   document.body.style.overflow = 'hidden';
   
   
   /* ========== CUSTOM CURSOR ========== */
   const cursor    = document.getElementById('cursor');
   const cursorDot = document.getElementById('cursorDot');
   
   let mouseX = 0, mouseY = 0;
   let curX = 0, curY = 0;
   
   document.addEventListener('mousemove', (e) => {
     mouseX = e.clientX;
     mouseY = e.clientY;
     // Dot follows instantly
     if (cursorDot) {
       cursorDot.style.left = mouseX + 'px';
       cursorDot.style.top  = mouseY + 'px';
     }
   });
   
   // Smooth cursor
   function animateCursor() {
     curX += (mouseX - curX) * 0.12;
     curY += (mouseY - curY) * 0.12;
     if (cursor) {
       cursor.style.left = curX + 'px';
       cursor.style.top  = curY + 'px';
     }
     requestAnimationFrame(animateCursor);
   }
   animateCursor();
   
   // Cursor state on interactive elements
   document.querySelectorAll('a, button, input, textarea').forEach(el => {
     el.addEventListener('mouseenter', () => {
       if (cursor) cursor.classList.add('cursor--hover');
     });
     el.addEventListener('mouseleave', () => {
       if (cursor) cursor.classList.remove('cursor--hover');
     });
   });
   
   
   /* ========== NAVIGATION ========== */
   const nav       = document.getElementById('nav');
   const navToggle = document.getElementById('navToggle');
   const navLinks  = document.getElementById('navLinks');
   
   // Scroll-based nav style
   window.addEventListener('scroll', () => {
     if (window.scrollY > 60) {
       nav.classList.add('scrolled');
     } else {
       nav.classList.remove('scrolled');
     }
   });
   
   // Mobile menu toggle
   if (navToggle && navLinks) {
     navToggle.addEventListener('click', () => {
       const isOpen = navLinks.classList.toggle('open');
       navToggle.classList.toggle('open', isOpen);
       document.body.style.overflow = isOpen ? 'hidden' : 'auto';
     });
   
     // Close on link click
     navLinks.querySelectorAll('a').forEach(link => {
       link.addEventListener('click', () => {
         navLinks.classList.remove('open');
         navToggle.classList.remove('open');
         document.body.style.overflow = 'auto';
       });
     });
   }
   
   // Active link on scroll
   const sections = document.querySelectorAll('section[id]');
   const navLinkEls = document.querySelectorAll('.nav-link');
   
   const sectionObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         navLinkEls.forEach(link => {
           link.classList.toggle(
             'active',
             link.getAttribute('href') === '#' + entry.target.id
           );
         });
       }
     });
   }, { threshold: 0.4 });
   
   sections.forEach(s => sectionObserver.observe(s));
   
   
   /* ========== SCROLL REVEAL ========== */
   const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
   
   const revealObserver = new IntersectionObserver((entries) => {
     entries.forEach((entry, i) => {
       if (entry.isIntersecting) {
         // Slight stagger for sibling elements
         const delay = entry.target.dataset.delay || 0;
         setTimeout(() => {
           entry.target.classList.add('visible');
         }, delay * 1000);
         revealObserver.unobserve(entry.target);
       }
     });
   }, {
     threshold: 0.12,
     rootMargin: '0px 0px -60px 0px'
   });
   
   function checkReveals() {
     revealEls.forEach((el, i) => {
       revealObserver.observe(el);
     });
   }
   
   // Also run on DOMContentLoaded as fallback
   document.addEventListener('DOMContentLoaded', () => {
     // Auto-add delay to sibling reveals
     document.querySelectorAll('.gallery-grid, .decoro-grid, .stats-row').forEach(parent => {
       Array.from(parent.children).forEach((child, i) => {
         child.dataset.delay = (i * 0.1).toFixed(1);
       });
     });
   });
   
   
   /* ========== SMOOTH ANCHOR SCROLL ========== */
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', (e) => {
       const target = document.querySelector(anchor.getAttribute('href'));
       if (!target) return;
       e.preventDefault();
       const offset = 80; // nav height
       const top = target.getBoundingClientRect().top + window.scrollY - offset;
       window.scrollTo({ top, behavior: 'smooth' });
     });
   });
   
   
   /* ========== CONTACT FORM ========== */
   const contactForm = document.getElementById('contactForm');
   const formFeedback = document.getElementById('formFeedback');
   
   if (contactForm) {
     contactForm.addEventListener('submit', async (e) => {
       e.preventDefault();
   
       const name    = document.getElementById('name').value.trim();
       const email   = document.getElementById('email').value.trim();
       const message = document.getElementById('message').value.trim();
   
       if (!name || !email || !message) {
         showFeedback('Per favore compila tutti i campi.', 'error');
         return;
       }
   
       if (!isValidEmail(email)) {
         showFeedback('Inserisci un indirizzo email valido.', 'error');
         return;
       }
   
       // Simulate sending (replace with your backend/EmailJS/Netlify Forms)
       const btn = contactForm.querySelector('button[type="submit"]');
       btn.textContent = 'Invio in corso…';
       btn.disabled = true;
   
       await delay(1500);
   
       showFeedback('Messaggio inviato! Ti rispondo presto. — Stefano', 'success');
       contactForm.reset();
       btn.textContent = 'Invia Messaggio';
       btn.disabled = false;
     });
   }
   
   function showFeedback(msg, type) {
     if (!formFeedback) return;
     formFeedback.textContent = msg;
     formFeedback.style.color = type === 'error' ? '#c0392b' : 'var(--gold)';
     setTimeout(() => { formFeedback.textContent = ''; }, 5000);
   }
   
   function isValidEmail(email) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }
   
   function delay(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
   }
   
   
   /* ========== PARALLAX ON HERO ========== */
   const heroDeco = document.querySelector('.hero-deco-num');
   const heroContent = document.querySelector('.hero-content');
   
   if (heroDeco || heroContent) {
     window.addEventListener('scroll', () => {
       const scrolled = window.scrollY;
       if (heroDeco)    heroDeco.style.transform    = `translateY(${scrolled * 0.2}px)`;
       if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
     }, { passive: true });
   }
   
   
   /* ========== IMAGE HOVER TILT ========== */
   document.querySelectorAll('.img-card, .decoro-card').forEach(card => {
     card.addEventListener('mousemove', (e) => {
       const rect = card.getBoundingClientRect();
       const x = e.clientX - rect.left;
       const y = e.clientY - rect.top;
       const centerX = rect.width  / 2;
       const centerY = rect.height / 2;
       const tiltX = ((y - centerY) / centerY) * 4;
       const tiltY = ((x - centerX) / centerX) * -4;
       card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
     });
   
     card.addEventListener('mouseleave', () => {
       card.style.transform = '';
       card.style.transition = 'transform 0.5s ease';
       setTimeout(() => { card.style.transition = ''; }, 500);
     });
   });
   
   
   /* ========== STAT NUMBER COUNT-UP ========== */
   function countUp(el, target, suffix) {
     if (target === '∞') { el.textContent = '∞'; return; }
     const num = parseInt(target);
     const duration = 1800;
     const step = num / (duration / 16);
     let current = 0;
     const timer = setInterval(() => {
       current = Math.min(current + step, num);
       el.textContent = Math.floor(current) + suffix;
       if (current >= num) clearInterval(timer);
     }, 16);
   }
   
   const statNums = document.querySelectorAll('.stat-num');
   let statsCounted = false;
   
   const statsObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting && !statsCounted) {
         statsCounted = true;
         statNums.forEach(el => {
           const txt = el.textContent;
           if (txt === '∞') return;
           const hasPlus = txt.includes('+');
           const num = txt.replace('+', '');
           countUp(el, num, hasPlus ? '+' : '');
         });
       }
     });
   }, { threshold: 0.5 });
   
   const statsRow = document.querySelector('.stats-row');
   if (statsRow) statsObserver.observe(statsRow);
   
   
   /* ========== MARQUEE PAUSE ON HOVER ========== */
   const marqueeTrack = document.querySelector('.marquee-track');
   if (marqueeTrack) {
     marqueeTrack.addEventListener('mouseenter', () => {
       marqueeTrack.style.animationPlayState = 'paused';
     });
     marqueeTrack.addEventListener('mouseleave', () => {
       marqueeTrack.style.animationPlayState = 'running';
     });
   }
   
   
   /* ========== GALLERY LIGHTBOX (simple) ========== */
   const galleryItems = document.querySelectorAll('.gallery-item');
   
   galleryItems.forEach(item => {
     item.style.cursor = 'none';
     item.addEventListener('click', () => {
       const label = item.querySelector('.gallery-label')?.textContent || 'Opera';
       createLightbox(label);
     });
   });
   
   function createLightbox(label) {
     const box = document.createElement('div');
     box.style.cssText = `
       position: fixed; inset: 0; z-index: 9000;
       background: rgba(13,12,11,0.96);
       display: flex; align-items: center; justify-content: center;
       flex-direction: column; gap: 1.5rem;
       animation: fadeIn 0.3s ease;
       cursor: none;
     `;
   
     const style = document.createElement('style');
     style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
     document.head.appendChild(style);
   
     const inner = document.createElement('div');
     inner.style.cssText = `
       width: min(600px, 90vw); height: min(400px, 60vh);
       background: #1a1815;
       display: flex; align-items: center; justify-content: center;
       border: 1px solid rgba(184,154,94,0.2);
     `;
     inner.innerHTML = `<span style="font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.4em;text-transform:uppercase;color:rgba(184,154,94,0.4);">${label}</span>`;
   
     const caption = document.createElement('p');
     caption.style.cssText = `font-family:'Raleway',sans-serif;font-size:0.6rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(201,191,168,0.5);`;
     caption.textContent = label + ' — Canton dell\'Arte';
   
     const close = document.createElement('button');
     close.style.cssText = `
       position: absolute; top: 2rem; right: 2rem;
       font-family:'Raleway',sans-serif;font-size:0.6rem;letter-spacing:0.3em;
       text-transform:uppercase;color:rgba(184,154,94,0.7);
       border: 1px solid rgba(184,154,94,0.3); padding: 0.6rem 1.2rem;
       cursor: none; background: transparent;
       transition: all 0.2s ease;
     `;
     close.textContent = 'Chiudi';
   
     close.addEventListener('click', () => document.body.removeChild(box));
     box.addEventListener('click', (e) => { if (e.target === box) document.body.removeChild(box); });
     document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.contains(box)) document.body.removeChild(box); }, { once: true });
   
     box.appendChild(inner);
     box.appendChild(caption);
     box.appendChild(close);
     document.body.appendChild(box);
   }
   
   
   /* ========== PAGE TRANSITIONS ========== */
   // Subtle page-in animation on load
   document.addEventListener('DOMContentLoaded', () => {
     document.body.style.opacity = '0';
     requestAnimationFrame(() => {
       document.body.style.transition = 'opacity 0.5s ease';
       document.body.style.opacity = '1';
     });
   });