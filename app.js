/* ===================================================
   VISUALS GALLERY — app.js
   Full interactivity: masonry, filters, lightbox,
   keyboard nav, search, sorting, likes
   =================================================== */

/* ===================================================
   SPLASH / LANDING PAGE
   3-second animated intro with particle canvas,
   progress bar, and smooth exit transition
   =================================================== */
(function initSplash() {
  const DURATION     = 6000; // ms total display time
  const EXIT_DELAY   = 5600; // ms when exit animation starts
  const REMOVE_DELAY = 6400; // ms when DOM node is hidden

  const splash       = document.getElementById('splash');
  const progressBar  = document.getElementById('splashProgress');
  const canvas       = document.getElementById('splashCanvas');

  if (!splash) return;

  // Lock body scroll
  document.body.classList.add('splash-active');

  /* ── Canvas particle system ── */
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Particle colors
  const COLORS = [
    'rgba(124,109,250,',   // accent purple
    'rgba(244,114,182,',   // pink
    'rgba(34,211,165,',    // green
    'rgba(251,146,60,',    // orange
    'rgba(255,255,255,',   // white
  ];

  function spawnParticle() {
    return {
      x: randomBetween(0, canvas.width),
      y: randomBetween(0, canvas.height),
      r: randomBetween(1, 3.5),
      vx: randomBetween(-0.35, 0.35),
      vy: randomBetween(-0.6, -0.1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: randomBetween(0.3, 0.85),
      life: 1,
      decay: randomBetween(0.003, 0.008),
    };
  }

  // Seed initial particles
  for (let i = 0; i < 120; i++) particles.push(spawnParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles[i] = spawnParticle();
        particles[i].y = canvas.height + 5; // respawn at bottom
        return;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (p.alpha * p.life) + ')';
      ctx.fill();
    });

    // Draw faint connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 90) * 0.12;
          ctx.strokeStyle = `rgba(124,109,250,${opacity})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(drawParticles);
  }

  drawParticles();

  /* ── Progress bar: fill over DURATION ms ── */
  // We use rAF-based approach so it's perfectly synced
  const startTime = performance.now();

  function updateProgress(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / DURATION, 1) * 100;
    progressBar.style.width = progress + '%';
    if (progress < 100) requestAnimationFrame(updateProgress);
  }
  requestAnimationFrame(updateProgress);

  /* ── Exit after EXIT_DELAY ── */
  setTimeout(() => {
    splash.classList.add('exit');
  }, EXIT_DELAY);

  /* ── Remove from view after REMOVE_DELAY ── */
  setTimeout(() => {
    // Stop particle animation
    cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resizeCanvas);

    splash.classList.add('gone');
    document.body.classList.remove('splash-active');
  }, REMOVE_DELAY);

})();

/* ===================================================
   IMAGE DATA
   =================================================== */
const IMAGES = [
  {
    id: 1,
    src: 'img_landscape.png',
    title: 'Mountain Vistas — Iceland',
    category: 'camera',
    author: 'Alex Mercer',
    likes: 1200,
    views: '2.1k',
    featured: true,
    height: 'tall',
  },
  {
    id: 2,
    src: 'img_portrait.png',
    title: 'Joy in the Streets',
    category: 'videos',
    author: 'Sofia Reyes',
    likes: 843,
    views: '1.4k',
    featured: false,
    height: 'medium',
  },
  {
    id: 3,
    src: 'img_urban.png',
    title: 'Concrete Geometry',
    category: 'screenshots',
    author: 'Marcus Lin',
    likes: 632,
    views: '980',
    featured: false,
    height: 'short',
  },
  {
    id: 4,
    src: 'img_nature.png',
    title: 'Golden Hour Pup',
    category: 'download',
    author: 'Lily Morgan',
    likes: 2100,
    views: '3.8k',
    featured: true,
    height: 'medium',
  },
  {
    id: 5,
    src: 'img_art.png',
    title: 'Urban Colour Burst',
    category: 'whatsapp',
    author: 'Derek Voss',
    likes: 455,
    views: '720',
    featured: false,
    height: 'tall',
  },
  {
    id: 6,
    src: 'img_forest.png',
    title: 'Forest Whispers',
    category: 'download',
    author: 'Nadia Osei',
    likes: 890,
    views: '1.1k',
    featured: false,
    height: 'medium',
  },
  /* Supplemental cards using reliable Unsplash CDN images */
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    title: 'Alpine Serenity',
    category: 'camera',
    author: 'Tom Hext',
    likes: 1680,
    views: '2.9k',
    featured: false,
    height: 'short',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    title: 'Endless Shore',
    category: 'pictures',
    author: 'Emma Dale',
    likes: 760,
    views: '1.2k',
    featured: false,
    height: 'medium',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80',
    title: 'Reflections at Dawn',
    category: 'camera',
    author: 'Hiro Yamada',
    likes: 1340,
    views: '2.3k',
    featured: false,
    height: 'tall',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    title: 'City Grind',
    category: 'screenshots',
    author: 'Carlos Rivera',
    likes: 512,
    views: '880',
    featured: false,
    height: 'short',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&q=80',
    title: 'Peak Explorer',
    category: 'pictures',
    author: 'Irina Volkov',
    likes: 944,
    views: '1.5k',
    featured: true,
    height: 'medium',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&q=80',
    title: 'Minimalist Study',
    category: 'videos',
    author: 'James Wu',
    likes: 307,
    views: '540',
    featured: false,
    height: 'tall',
  },
  {
    id: 13,
    src: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&q=80',
    title: 'Cosmos Gaze',
    category: 'camera',
    author: 'Fatima Al-Rashid',
    likes: 2890,
    views: '4.6k',
    featured: true,
    height: 'short',
  },
  {
    id: 14,
    src: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600&q=80',
    title: 'Pixels & Paint',
    category: 'whatsapp',
    author: 'Luca Bianchi',
    likes: 670,
    views: '1.1k',
    featured: false,
    height: 'medium',
  },
  {
    id: 15,
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    title: 'Sundown Fields',
    category: 'download',
    author: 'Priya Shan',
    likes: 1120,
    views: '1.9k',
    featured: false,
    height: 'short',
  },
  {
    id: 16,
    src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=600&q=80',
    title: 'Desert Mirage',
    category: 'pictures',
    author: 'Omar Khalid',
    likes: 435,
    views: '790',
    featured: false,
    height: 'tall',
  },
  {
    id: 17,
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    title: 'Neon Metropolis',
    category: 'screenshots',
    author: 'Yuki Tanaka',
    likes: 1876,
    views: '3.1k',
    featured: true,
    height: 'medium',
  },
  {
    id: 18,
    src: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600&q=80',
    title: 'Coastal Wanderer',
    category: 'pictures',
    author: 'Chloe Petit',
    likes: 720,
    views: '1.0k',
    featured: false,
    height: 'short',
  },
];

/* ===================================================
   STATE
   =================================================== */
let state = {
  filter: 'all',
  sort: 'trending',
  search: '',
  view: 'masonry',
  lightboxIndex: 0,
  lightboxOpen: false,
  likes: {},       // { id: bool }
  likesCounts: {}, // { id: number }
};

/* ===================================================
   DOM REFS
   =================================================== */
const galleryGrid    = document.getElementById('galleryGrid');
const noResults      = document.getElementById('noResults');
const photoCount     = document.getElementById('photoCount');
const categoryList   = document.getElementById('categoryList');
const sortList       = document.getElementById('sortList');
const filterChips    = document.getElementById('filterChips');
const searchInput    = document.getElementById('searchInput');
const masonryBtn     = document.getElementById('masonryBtn');
const gridBtn        = document.getElementById('gridBtn');
const lightbox       = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lbImage        = document.getElementById('lbImage');
const lbLoader       = document.getElementById('lbLoader');
const lbTitle        = document.getElementById('lbTitle');
const lbCategory     = document.getElementById('lbCategory');
const lbPrev         = document.getElementById('lbPrev');
const lbNext         = document.getElementById('lbNext');
const lbClose        = document.getElementById('lbClose');
const lbCounter      = document.getElementById('lbCounter');
const lbLikeBtn      = document.getElementById('lbLikeBtn');
const lbLikeCount    = document.getElementById('lbLikeCount');
const scrollTopBtn   = document.getElementById('scrollTop');
const hamburgerBtn   = document.getElementById('hamburgerBtn');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const categoriesToggleBtn = document.getElementById('categoriesToggleBtn');
const uploadBtn      = document.getElementById('uploadBtn');
const uploadModal    = document.getElementById('uploadModal');
const uploadClose    = document.getElementById('uploadClose');
const uploadBackdrop = document.getElementById('uploadBackdrop');
const copyLinkBtn    = document.getElementById('copyLinkBtn');
const shareLinkInput = document.getElementById('shareLinkInput');

/* ===================================================
   INIT
   =================================================== */
function init() {
  // Seed likes
  IMAGES.forEach(img => {
    state.likes[img.id] = false;
    state.likesCounts[img.id] = img.likes;
  });
  renderGallery();
  bindEvents();
}

/* ===================================================
   RENDER
   =================================================== */
function getFilteredImages() {
  let imgs = [...IMAGES];

  // Category filter
  if (state.filter !== 'all') {
    imgs = imgs.filter(i => i.category === state.filter);
  }

  // Search filter
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    imgs = imgs.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.author.toLowerCase().includes(q)
    );
  }

  // Sort
  if (state.sort === 'popular') {
    imgs.sort((a, b) => b.likes - a.likes);
  } else if (state.sort === 'newest') {
    imgs.sort((a, b) => b.id - a.id);
  } else {
    // trending — featured first
    imgs.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return imgs;
}

function renderGallery() {
  const imgs = getFilteredImages();
  galleryGrid.innerHTML = '';

  if (imgs.length === 0) {
    noResults.style.display = 'block';
    photoCount.textContent = '0 Photos';
    return;
  }
  noResults.style.display = 'none';
  photoCount.textContent = `${imgs.length} Photo${imgs.length !== 1 ? 's' : ''}`;

  imgs.forEach((img, idx) => {
    const card = createCard(img, idx);
    galleryGrid.appendChild(card);
  });
}

function createCard(img, idx) {
  const likes = state.likesCounts[img.id];
  const liked  = state.likes[img.id];

  const card = document.createElement('div');
  card.className = `card${img.featured ? ' featured' : ''}`;
  card.dataset.id = img.id;
  card.style.animationDelay = `${idx * 0.04}s`;

  // Aspect ratio heuristic
  const aspectMap = { tall: '3/4', medium: '4/5', short: '16/10' };
  const aspect = aspectMap[img.height] || '4/5';

  card.innerHTML = `
    <div class="card-img-wrap" style="aspect-ratio:${aspect}">
      <img
        src="${img.src}"
        alt="${img.title}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1559181567-c3190bfbf68a?w=600&q=80'"
      />
      <span class="card-badge badge-${img.category}">${img.category}</span>
      <button class="card-like-btn${liked ? ' liked' : ''}" aria-label="Like">
        <svg viewBox="0 0 24 24" fill="${liked ? 'white' : 'none'}" stroke="white" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="card-overlay">
        <div class="card-overlay-content">
          <div class="card-overlay-title">${img.title}</div>
          <div class="card-overlay-meta">
            <div class="card-author">
              <div class="author-avatar">${img.author[0]}</div>
              <span class="author-name">${img.author}</span>
            </div>
            <div class="card-stats">
              <span class="stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                ${formatNumber(likes)}
              </span>
              <span class="stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                ${img.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-info">
      <div class="card-info-title">${img.title}</div>
      <div class="card-info-sub">
        <span class="card-info-author">${img.author}</span>
        <div class="card-info-stats">
          <span class="info-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ${formatNumber(likes)}
          </span>
          <span class="info-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            ${img.views}
          </span>
        </div>
      </div>
    </div>
  `;

  // Click on card → open lightbox
  card.querySelector('.card-img-wrap').addEventListener('click', () => {
    const visible = getFilteredImages();
    const idx2 = visible.findIndex(i => i.id === img.id);
    openLightbox(idx2);
  });

  // Like button
  const likeBtn = card.querySelector('.card-like-btn');
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike(img.id);
    // pulse animation
    likeBtn.classList.add('liked');
    likeBtn.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.4)' },
      { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease' });
  });

  return card;
}

/* ===================================================
   HELPERS
   =================================================== */
function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

function toggleLike(id) {
  state.likes[id] = !state.likes[id];
  state.likesCounts[id] += state.likes[id] ? 1 : -1;
  renderGallery();
  if (state.lightboxOpen) updateLightboxUI();
}

/* ===================================================
   LIGHTBOX
   =================================================== */
function openLightbox(idx) {
  state.lightboxIndex = idx;
  state.lightboxOpen  = true;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  loadLightboxImage('in');
}

function closeLightbox() {
  state.lightboxOpen = false;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function loadLightboxImage(direction) {
  const imgs = getFilteredImages();
  const img  = imgs[state.lightboxIndex];
  if (!img) return;

  // Show loader
  lbLoader.classList.add('visible');
  lbImage.classList.add('loading');

  // Slide direction
  lbImage.classList.remove('slide-left', 'slide-right');
  if (direction === 'next') {
    void lbImage.offsetWidth; // reflow
    lbImage.classList.add('slide-left');
  } else if (direction === 'prev') {
    void lbImage.offsetWidth;
    lbImage.classList.add('slide-right');
  }

  const newImg = new Image();
  newImg.src = img.src;
  newImg.onload = () => {
    lbImage.src = img.src;
    lbImage.alt = img.title;
    lbLoader.classList.remove('visible');
    lbImage.classList.remove('loading');
    updateLightboxUI();
  };
  newImg.onerror = () => {
    lbImage.src = 'https://images.unsplash.com/photo-1559181567-c3190bfbf68a?w=900&q=80';
    lbLoader.classList.remove('visible');
    lbImage.classList.remove('loading');
    updateLightboxUI();
  };
}

function updateLightboxUI() {
  const imgs = getFilteredImages();
  const img  = imgs[state.lightboxIndex];
  if (!img) return;

  lbTitle.textContent    = img.title;
  lbCategory.textContent = img.category.toUpperCase();
  lbCounter.textContent  = `${state.lightboxIndex + 1} / ${imgs.length}`;

  const liked = state.likes[img.id];
  lbLikeBtn.className = `lb-like-btn${liked ? ' liked' : ''}`;
  lbLikeBtn.querySelector('svg').setAttribute('fill', liked ? 'var(--pink)' : 'none');
  lbLikeCount.textContent = formatNumber(state.likesCounts[img.id]);

  lbPrev.disabled = state.lightboxIndex === 0;
  lbNext.disabled = state.lightboxIndex === imgs.length - 1;
}

function navigateLightbox(dir) {
  const imgs = getFilteredImages();
  const newIdx = state.lightboxIndex + dir;
  if (newIdx < 0 || newIdx >= imgs.length) return;
  state.lightboxIndex = newIdx;
  loadLightboxImage(dir === 1 ? 'next' : 'prev');
}

/* ===================================================
   FILTER & SORT
   =================================================== */
function setFilter(val) {
  state.filter = val;

  // Update sidebar
  document.querySelectorAll('#categoryList li').forEach(li => {
    li.classList.toggle('active', li.dataset.filter === val);
  });

  // Update chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === val);
  });

  renderGallery();
}

function setSort(val) {
  state.sort = val;
  document.querySelectorAll('#sortList li').forEach(li => {
    li.classList.toggle('active', li.dataset.sort === val);
  });
  renderGallery();
}

/* ===================================================
   VIEW TOGGLE
   =================================================== */
function setView(view) {
  state.view = view;
  galleryGrid.className = `gallery-grid ${view}`;
  masonryBtn.classList.toggle('active', view === 'masonry');
  gridBtn.classList.toggle('active', view === 'grid');
}

/* ===================================================
   BIND EVENTS
   =================================================== */
function bindEvents() {
  /* Category sidebar */
  categoryList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => setFilter(li.dataset.filter));
  });

  /* Sort sidebar */
  sortList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => setSort(li.dataset.sort));
  });

  /* Filter chips */
  filterChips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => setFilter(chip.dataset.filter));
  });

  /* Search */
  searchInput.addEventListener('input', debounce(() => {
    state.search = searchInput.value;
    renderGallery();
  }, 280));

  /* View toggle */
  masonryBtn.addEventListener('click', () => setView('masonry'));
  gridBtn.addEventListener('click', () => setView('grid'));

  /* Lightbox */
  lbClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigateLightbox(-1));
  lbNext.addEventListener('click', () => navigateLightbox(1));

  lbLikeBtn.addEventListener('click', () => {
    const imgs = getFilteredImages();
    const img  = imgs[state.lightboxIndex];
    if (img) {
      toggleLike(img.id);
      // bounce
      lbLikeBtn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' }
      ], { duration: 300, easing: 'ease' });
    }
  });

  /* Keyboard nav */
  document.addEventListener('keydown', (e) => {
    if (!state.lightboxOpen) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* Touch/swipe on lightbox */
  let touchStartX = null;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigateLightbox(dx < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  /* Scroll to top */
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Hamburger / mobile sidebar */
  hamburgerBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebarMobile);

  /* Categories Topbar Toggle */
  if (categoriesToggleBtn) {
    categoriesToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSidebarDesktop();
    });
  }

  /* Upload / Share Modal */
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      uploadModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (uploadClose) {
    uploadClose.addEventListener('click', closeUploadModal);
  }
  if (uploadBackdrop) {
    uploadBackdrop.addEventListener('click', closeUploadModal);
  }
  
  if (copyLinkBtn && shareLinkInput) {
    copyLinkBtn.addEventListener('click', () => {
      shareLinkInput.select();
      shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied!';
        copyLinkBtn.style.background = 'var(--green)';
        setTimeout(() => {
          copyLinkBtn.textContent = originalText;
          copyLinkBtn.style.background = '';
        }, 2000);
      });
    });
  }
}

function toggleSidebarDesktop() {
  sidebar.classList.toggle('open');
  document.querySelector('.main-wrapper').classList.toggle('sidebar-open');
}

function closeUploadModal() {
  uploadModal.classList.remove('open');
  if (!sidebar.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function toggleSidebar() {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('show');
  document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}
function closeSidebarMobile() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

/* ===================================================
   DEBOUNCE
   =================================================== */
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* ===================================================
   BOOT
   =================================================== */
document.addEventListener('DOMContentLoaded', init);
