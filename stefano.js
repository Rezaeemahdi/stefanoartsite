/* ═══════════════════════════════════════════════════
   CANTON DELL'ARTE — script.js
   ═══════════════════════════════════════════════════ */
   'use strict';

   /* ── LOADER ────────────────────────────────────────── */
   window.addEventListener('load', () => {
     const loader = document.getElementById('loader');
     setTimeout(() => {
       loader.classList.add('gone');
       document.body.style.overflow = 'auto';
       startReveals();
     }, 2300);
   });
   document.body.style.overflow = 'hidden';
   
   /* ── NAV ─────────────────────────────────────────────── */
   const nav     = document.getElementById('siteNav');
   const burger  = document.getElementById('burger');
   const navLink = document.getElementById('navLinks');
   const btt     = document.getElementById('btt');
   const allNL   = navLink.querySelectorAll('.nl');
   
   window.addEventListener('scroll', () => {
     nav.classList.toggle('sticky', window.scrollY > 55);
     btt.classList.toggle('show', window.scrollY > 500);
   }, { passive: true });
   
   burger.addEventListener('click', () => {
     const open = navLink.classList.toggle('open');
     burger.classList.toggle('open', open);
     burger.setAttribute('aria-expanded', open);
     document.body.style.overflow = open ? 'hidden' : 'auto';
   });
   
   navLink.querySelectorAll('a').forEach(a => {
     a.addEventListener('click', () => {
       navLink.classList.remove('open');
       burger.classList.remove('open');
       burger.setAttribute('aria-expanded', false);
       document.body.style.overflow = 'auto';
     });
   });
   
   /* Active nav highlight on scroll */
   const sections = document.querySelectorAll('section[id]');
   const secObs = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         const id = '#' + e.target.id;
         allNL.forEach(l => l.classList.toggle('act', l.getAttribute('href') === id));
       }
     });
   }, { threshold: 0.3 });
   sections.forEach(s => secObs.observe(s));
   
   /* ── SMOOTH SCROLL ───────────────────────────────────── */
   document.querySelectorAll('a[href^="#"]').forEach(a => {
     a.addEventListener('click', e => {
       const t = document.querySelector(a.getAttribute('href'));
       if (!t) return;
       e.preventDefault();
       window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
     });
   });
   
   /* ── BACK TO TOP ─────────────────────────────────────── */
   btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
   
   /* ── SCROLL REVEAL ───────────────────────────────────── */
   function startReveals() {
     const obs = new IntersectionObserver(entries => {
       entries.forEach(e => {
         if (e.isIntersecting) {
           e.target.classList.add('in');
           obs.unobserve(e.target);
         }
       });
     }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
     document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
   }
   
   /* ── LIGHTBOX ────────────────────────────────────────── */
   const lb      = document.getElementById('lb');
   const lbBg    = document.getElementById('lbBg');
   const lbX     = document.getElementById('lbX');
   const lbPrev  = document.getElementById('lbPrev');
   const lbNext  = document.getElementById('lbNext');
   const lbImg   = document.getElementById('lbImg');
   const lbCap   = document.getElementById('lbCap');
   
   let lbGroup = [], lbIdx = 0;
   
   function buildLightbox() {
     // All photo-grid containers
     document.querySelectorAll('.photo-grid[data-lb]').forEach(grid => {
       const figs = Array.from(grid.querySelectorAll('figure.pg-item'));
       figs.forEach((fig, i) => {
         const img = fig.querySelector('img');
         if (!img) return;
         fig.style.cursor = 'zoom-in';
         fig.addEventListener('click', () => {
           lbGroup = figs.map(f => ({
             src: f.querySelector('img')?.src || '',
             cap: f.dataset.caption || f.querySelector('figcaption')?.textContent?.trim() || ''
           }));
           lbIdx = i;
           openLb();
         });
       });
     });
     // Pittura strip
     document.querySelectorAll('.pittura-strip[data-lb]').forEach(grid => {
       const figs = Array.from(grid.querySelectorAll('figure'));
       figs.forEach((fig, i) => {
         const img = fig.querySelector('img');
         if (!img) return;
         fig.style.cursor = 'zoom-in';
         fig.addEventListener('click', () => {
           lbGroup = figs.map(f => ({
             src: f.querySelector('img')?.src || '',
             cap: f.dataset.caption || f.querySelector('figcaption')?.textContent?.trim() || ''
           }));
           lbIdx = i;
           openLb();
         });
       });
     });
   }
   
   function openLb() {
     const d = lbGroup[lbIdx];
     if (!d || !d.src) return;
     lbImg.src = d.src;
     lbImg.alt = d.cap;
     lbCap.textContent = d.cap;
     lb.classList.add('open');
     document.body.style.overflow = 'hidden';
     syncNav();
   }
   
   function closeLb() {
     lb.classList.remove('open');
     document.body.style.overflow = 'auto';
     setTimeout(() => { lbImg.src = ''; }, 300);
   }
   
   function syncNav() {
     lbPrev.style.opacity = lbIdx > 0 ? '1' : '0.2';
     lbNext.style.opacity = lbIdx < lbGroup.length - 1 ? '1' : '0.2';
   }
   
   lbX.addEventListener('click', closeLb);
   lbBg.addEventListener('click', closeLb);
   lbPrev.addEventListener('click', () => { if (lbIdx > 0) { lbIdx--; openLb(); } });
   lbNext.addEventListener('click', () => { if (lbIdx < lbGroup.length - 1) { lbIdx++; openLb(); } });
   
   document.addEventListener('keydown', e => {
     if (!lb.classList.contains('open')) return;
     if (e.key === 'Escape')      closeLb();
     if (e.key === 'ArrowLeft')   lbPrev.click();
     if (e.key === 'ArrowRight')  lbNext.click();
   });
   
   // Touch swipe
   let tx0 = 0;
   lb.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
   lb.addEventListener('touchend', e => {
     const diff = tx0 - e.changedTouches[0].clientX;
     if (Math.abs(diff) > 50) { diff > 0 ? lbNext.click() : lbPrev.click(); }
   });
   
   buildLightbox();
   
   /* ── CONTACT FORM ────────────────────────────────────── */
   const form     = document.getElementById('contactForm');
   const fBtn     = document.getElementById('fBtn');
   const fResponse = document.getElementById('fResponse');
   
   function fe(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
   function clearFe() { ['fnErr','feErr','fmErr'].forEach(id => fe(id,'')); fResponse.textContent = ''; }
   
   if (form) {
     form.addEventListener('submit', async e => {
       e.preventDefault();
       clearFe();
       const name  = document.getElementById('fn').value.trim();
       const email = document.getElementById('fe').value.trim();
       const msg   = document.getElementById('fm').value.trim();
       let valid = true;
       if (!name)  { fe('fnErr','Inserisci il tuo nome'); valid = false; }
       if (!email) { fe('feErr','Inserisci la tua email'); valid = false; }
       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fe('feErr','Email non valida'); valid = false; }
       if (!msg)   { fe('fmErr','Scrivi un messaggio'); valid = false; }
       if (!valid) return;
   
       fBtn.classList.add('loading');
       fBtn.disabled = true;
   
       // Simulate send — replace with your backend / EmailJS / Netlify Forms
       await new Promise(r => setTimeout(r, 1800));
   
       fResponse.textContent = 'Messaggio inviato! Ti rispondo presto. — Stefano';
       fResponse.style.color = 'var(--walnut)';
       form.reset();
       fBtn.classList.remove('loading');
       fBtn.disabled = false;
       setTimeout(() => { fResponse.textContent = ''; }, 8000);
     });
   }
   
   /* ── STAT COUNT-UP ───────────────────────────────────── */
   let counted = false;
   const statsEl = document.querySelector('.cs-stats');
   if (statsEl) {
     new IntersectionObserver(entries => {
       if (!entries[0].isIntersecting || counted) return;
       counted = true;
       document.querySelectorAll('.cs-n[data-to]').forEach(el => {
         const target = parseInt(el.dataset.to);
         if (isNaN(target)) return;
         const suf = el.dataset.suf || '';
         let cur = 0;
         const inc = target / 60;
         const t = setInterval(() => {
           cur = Math.min(cur + inc, target);
           el.textContent = Math.floor(cur) + suf;
           if (cur >= target) clearInterval(t);
         }, 18);
       });
     }, { threshold: 0.5 }).observe(statsEl);
   }
   
   /* ── PARALLAX hero stripe ────────────────────────────── */
   const heroStripe = document.querySelector('.hero-stripe');
   window.addEventListener('scroll', () => {
     if (heroStripe) heroStripe.style.transform = `translateY(${window.scrollY * .14}px)`;
   }, { passive: true });
   
   /* ── SUBTLE TILT on key images ───────────────────────── */
   ['.atelier-cover', '.tt-img', '.cs-portrait-inner'].forEach(sel => {
     document.querySelectorAll(sel).forEach(el => {
       el.addEventListener('mousemove', ev => {
         const r = el.getBoundingClientRect();
         const x = ((ev.clientY - r.top) / r.height - .5) * 3;
         const y = ((ev.clientX - r.left) / r.width - .5) * -3;
         el.style.transform = `perspective(900px) rotateX(${x}deg) rotateY(${y}deg)`;
       });
       el.addEventListener('mouseleave', () => { el.style.transform = ''; });
     });
   });