/**
 * SRI KRISHNA YAJUR VEDA PARAYANA TRUST - CHIDAMBARAM
 * Main Portal Engine & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initMobileMenu();
  initDevotionalAudio();
  initFestivalTabs();
  initDonationModal();
  initPanchangamClock();
  initVisitorCounter();
});

/* ==========================================================================
   HERO BANNER SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(idx);
      startAutoSlide();
    });
  });

  startAutoSlide();
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains('show')) {
      nav.classList.remove('show');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
}

/* ==========================================================================
   DEVOTIONAL VEDIC & TEMPLE AUDIO (Web Audio Synthesizer)
   Produces a soothing, authentic 136.1 Hz Cosmic Om & Temple Bell chime!
   ========================================================================== */
let audioContext = null;
let isAudioPlaying = false;
let audioNodes = [];

function initDevotionalAudio() {
  const playButtons = document.querySelectorAll('.audio-toggle, #globalAudioBtn');
  const statusLabel = document.getElementById('audioStatusLabel');

  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isAudioPlaying) {
        startVedicHarmonics();
        isAudioPlaying = true;
        btn.classList.add('playing');
        if (statusLabel) statusLabel.textContent = "Chanting: OM NAMAH SHIVAYA";
        updateAllAudioButtons(true);
      } else {
        stopVedicHarmonics();
        isAudioPlaying = false;
        btn.classList.remove('playing');
        if (statusLabel) statusLabel.textContent = "Click to Listen Divine Chants";
        updateAllAudioButtons(false);
      }
    });
  });
}

function updateAllAudioButtons(playing) {
  document.querySelectorAll('.audio-toggle, #globalAudioBtn').forEach(btn => {
    const icon = btn.querySelector('i');
    if (playing) {
      btn.classList.add('playing');
      if (icon) icon.className = "fas fa-volume-up";
    } else {
      btn.classList.remove('playing');
      if (icon) icon.className = "fas fa-volume-mute";
    }
  });
}

function startVedicHarmonics() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();

    // 136.1 Hz is the sacred primordial Om frequency (Earth year tone / Anahata chakra)
    const baseFreq = 136.1;
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const osc3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, audioContext.currentTime);

    // Harmonic overtone for temple resonance
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.00, audioContext.currentTime);

    // Fifth harmonic for divine tanpura feel
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime);

    const gain1 = audioContext.createGain();
    const gain2 = audioContext.createGain();
    const gain3 = audioContext.createGain();

    gain1.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain2.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain3.gain.setValueAtTime(0.04, audioContext.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(gainNode);
    gain2.connect(gainNode);
    gain3.connect(gainNode);

    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 3);

    gainNode.connect(audioContext.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    // Periodic gentle temple bell chime every 7 seconds
    const bellInterval = setInterval(() => {
      if (!isAudioPlaying || !audioContext) {
        clearInterval(bellInterval);
        return;
      }
      playTempleChime(audioContext, baseFreq * 4);
    }, 7000);

    audioNodes = [osc1, osc2, osc3, gainNode, bellInterval];
  } catch (err) {
    console.error("Devotional audio not allowed or failed:", err);
  }
}

function playTempleChime(ctx, freq) {
  try {
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(freq, ctx.currentTime);

    chimeGain.gain.setValueAtTime(0.12, ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    chimeOsc.start();
    chimeOsc.stop(ctx.currentTime + 3.6);
  } catch (e) {
    // Ignore audio errors
  }
}

function stopVedicHarmonics() {
  if (audioNodes && audioNodes.length) {
    try {
      if (audioNodes[4]) clearInterval(audioNodes[4]);
      if (audioNodes[0]) audioNodes[0].stop();
      if (audioNodes[1]) audioNodes[1].stop();
      if (audioNodes[2]) audioNodes[2].stop();
    } catch(e) {}
    audioNodes = [];
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
    audioContext = null;
  }
}

/* ==========================================================================
   FESTIVAL FILTER TABS
   ========================================================================== */
function initFestivalTabs() {
  const tabBtns = document.querySelectorAll('.festival-tab-btn');
  const cards = document.querySelectorAll('.festival-card');
  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   LIVE PANCHANGAM & CLOCK (Chidambaram Local Time)
   ========================================================================== */
function initPanchangamClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    };
    clockEl.textContent = now.toLocaleDateString('en-IN', options);
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   ONLINE SEVA & E-HUNDI INTERACTIVE MODAL & RECEIPT GENERATOR
   ========================================================================== */
function initDonationModal() {
  const sevaButtons = document.querySelectorAll('.seva-option-btn');
  const sevaAmountInput = document.getElementById('donationAmount');
  const selectedSevaInput = document.getElementById('selectedSevaName');
  const donationForm = document.getElementById('onlineSevaForm');
  const modal = document.getElementById('receiptModal');
  const closeBtn = document.querySelector('.receipt-close-btn');

  if (sevaButtons.length && sevaAmountInput) {
    sevaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sevaButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const amount = btn.getAttribute('data-amount');
        const name = btn.getAttribute('data-name');
        
        sevaAmountInput.value = amount;
        if (selectedSevaInput) selectedSevaInput.value = name;
      });
    });
  }

  if (donationForm && modal) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const devoteeName = document.getElementById('devoteeName')?.value || 'Devotee';
      const devoteeGothram = document.getElementById('devoteeGothram')?.value || 'Kashyapa';
      const devoteeNakshatram = document.getElementById('devoteeNakshatram')?.value || 'Thiruvathirai';
      const sevaName = selectedSevaInput?.value || 'Sri Krishna Yajur Veda Parayana Seva';
      const amount = sevaAmountInput?.value || '1008';
      const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const receiptNo = 'SKYVPT-' + Math.floor(100000 + Math.random() * 900000);

      // Populate Receipt Details
      document.getElementById('receiptDevoteeName').textContent = devoteeName;
      document.getElementById('receiptGothram').textContent = devoteeGothram;
      document.getElementById('receiptNakshatram').textContent = devoteeNakshatram;
      document.getElementById('receiptSevaName').textContent = sevaName;
      document.getElementById('receiptAmount').textContent = '₹ ' + parseInt(amount).toLocaleString('en-IN');
      document.getElementById('receiptDate').textContent = date;
      document.getElementById('receiptNumber').textContent = receiptNo;

      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

function printReceipt() {
  window.print();
}

/* ==========================================================================
   VISITOR COUNTER SIMULATOR
   ========================================================================== */
function initVisitorCounter() {
  const counterEl = document.getElementById('visitorCounterVal');
  if (!counterEl) return;
  
  let baseCount = 842190;
  try {
    let saved = localStorage.getItem('skyvpt_visitor_count');
    if (saved) {
      baseCount = parseInt(saved, 10) + 1;
    } else {
      baseCount = 842190 + Math.floor(Math.random() * 50);
    }
    localStorage.setItem('skyvpt_visitor_count', baseCount);
  } catch(e) {}
  
  counterEl.textContent = baseCount.toLocaleString('en-IN');
}
