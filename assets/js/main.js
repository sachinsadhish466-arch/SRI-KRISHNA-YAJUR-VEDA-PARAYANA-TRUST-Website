/**
 * SRI KRISHNA YAJUR VEDA PARAYANA TRUST - CHIDAMBARAM
 * Main Portal Engine & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initTempleVideoLoader();
  initHeroSlider();
  initMobileMenu();
  initDevotionalAudio();
  initFestivalTabs();
  initDonationModal();
  initPanchangamClock();
  initVisitorCounter();
  initLanguageTranslation();
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

  // Close when clicking any nav link (critical for smooth mobile navigation)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
}

/* ==========================================================================
   DEVOTIONAL AUDIO PLAYER (Sri Nataraja Sahasranamam)
   Authentic sacred audio chant player
   ========================================================================== */
let devotionalAudio = null;
let isAudioPlaying = false;

function initDevotionalAudio() {
  const playButtons = document.querySelectorAll('.audio-toggle, #globalAudioBtn');
  const statusLabel = document.getElementById('audioStatusLabel');

  if (!devotionalAudio) {
    devotionalAudio = new Audio('assets/audio/sri-nataraja-sahasranamam.mp3');
    devotionalAudio.preload = 'metadata';

    devotionalAudio.addEventListener('ended', () => {
      isAudioPlaying = false;
      updateAllAudioButtons(false);
      if (statusLabel) statusLabel.textContent = "Sri Nataraja Sahasranamam";
    });

    devotionalAudio.addEventListener('pause', () => {
      if (isAudioPlaying) {
        isAudioPlaying = false;
        updateAllAudioButtons(false);
        if (statusLabel) statusLabel.textContent = "Sri Nataraja Sahasranamam";
      }
    });
  }

  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isAudioPlaying) {
        devotionalAudio.play().then(() => {
          isAudioPlaying = true;
          updateAllAudioButtons(true);
          if (statusLabel) statusLabel.textContent = "Playing: Sri Nataraja Sahasranamam";
        }).catch(err => {
          console.warn("Audio playback gesture required or failed:", err);
        });
      } else {
        devotionalAudio.pause();
        isAudioPlaying = false;
        updateAllAudioButtons(false);
        if (statusLabel) statusLabel.textContent = "Sri Nataraja Sahasranamam";
      }
    });
  });
}

function updateAllAudioButtons(playing) {
  document.querySelectorAll('.audio-toggle, #globalAudioBtn').forEach(btn => {
    const isFloatingBarBtn = btn.closest('.devotional-audio-bar');
    if (playing) {
      btn.classList.add('playing');
      if (isFloatingBarBtn) {
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      } else {
        const icon = btn.querySelector('i');
        if (icon) icon.className = "fas fa-volume-up";
      }
    } else {
      btn.classList.remove('playing');
      if (isFloatingBarBtn) {
        btn.innerHTML = '<i class="fas fa-play"></i> Play';
      } else {
        const icon = btn.querySelector('i');
        if (icon) icon.className = "fas fa-volume-mute";
      }
    }
  });
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

/* ==========================================================================
   10-SECOND SACRED VIDEO LOADING SCREEN
   Temple Sanctum Cinematic Video Experience (10 Seconds)
   ========================================================================== */
function initTempleVideoLoader() {
  const loader = document.getElementById('templeVideoLoader');
  if (!loader) return;

  const video = document.getElementById('loaderVideo');
  const skipBtn = document.getElementById('loaderSkipBtn');
  const soundBtn = document.getElementById('loaderSoundBtn');
  const soundIcon = document.getElementById('loaderSoundIcon');
  const soundText = document.getElementById('loaderSoundText');
  const progressFill = document.getElementById('loaderProgressFill');
  const countdownPill = document.getElementById('loaderCountdown');
  const currentSecEl = document.getElementById('loaderCurrentSec');
  const statusMsg = document.getElementById('loaderStatusMsg');

  const TOTAL_DURATION_MS = 10000; // Exactly 10 seconds
  let startTime = null;
  let animFrameId = null;
  let isDone = false;

  // Lock body scroll while video loading screen is active
  document.body.classList.add('loading-active');

  // Attempt automatic video playback
  if (video) {
    video.muted = true; // Browser policy permits autoplay when muted
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay waiting for user gesture:', err);
      });
    }

    // Toggle Sound control
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted) {
          video.muted = false;
          if (soundIcon) soundIcon.className = 'fas fa-volume-up';
          if (soundText) soundText.textContent = 'Mute';
          soundBtn.classList.add('sound-active');
        } else {
          video.muted = true;
          if (soundIcon) soundIcon.className = 'fas fa-volume-mute';
          if (soundText) soundText.textContent = 'Sound';
          soundBtn.classList.remove('sound-active');
        }
      });
    }

    // When video naturally ends, transition out
    video.addEventListener('ended', () => {
      finishLoader();
    });
  }

  // Smooth 60fps progress bar and 10s countdown animation
  function updateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min((elapsed / TOTAL_DURATION_MS) * 100, 100);

    if (progressFill) {
      progressFill.style.width = progress + '%';
    }

    const remainingSec = Math.max(0, Math.ceil((TOTAL_DURATION_MS - elapsed) / 1000));
    const currentSec = Math.min(10, Math.floor(elapsed / 1000));

    if (countdownPill) {
      countdownPill.textContent = remainingSec + 's';
    }
    if (currentSecEl) {
      currentSecEl.textContent = currentSec;
    }

    // Dynamic devotional status captions
    if (statusMsg) {
      if (elapsed > 7200) {
        statusMsg.textContent = 'Sanctum Sanctorum Revealed • Welcome to Sacred Kshetram';
      } else if (elapsed > 3800) {
        statusMsg.textContent = 'Sri Krishna Yajur Veda Parayana Trust • Chidambara Mahatmyam';
      }
    }

    if (elapsed < TOTAL_DURATION_MS && !isDone) {
      animFrameId = requestAnimationFrame(updateProgress);
    } else if (!isDone) {
      finishLoader();
    }
  }

  animFrameId = requestAnimationFrame(updateProgress);

  function finishLoader() {
    if (isDone) return;
    isDone = true;

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
    }

    if (progressFill) progressFill.style.width = '100%';
    if (countdownPill) countdownPill.textContent = '0s';
    if (currentSecEl) currentSecEl.textContent = '10';

    loader.classList.add('loader-finished');
    document.body.classList.remove('loading-active');

    if (video) {
      try {
        video.pause();
      } catch (e) {}
    }

    setTimeout(() => {
      loader.style.display = 'none';
    }, 850);
  }

  // Skip Intro button for immediate entrance
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishLoader();
    });
  }
}

/* ==========================================================================
   TAMIL & ENGLISH BILINGUAL TRANSLATION ENGINE
   Seamless top-bar language switcher with full spiritual vocabulary
   ========================================================================== */
const TAMIL_DICTIONARY = {
  // Navigation Links
  "Home": "முகப்பு",
  "About Trust": "அறக்கட்டளை பற்றி",
  "Chidambaram Temple": "சிதம்பரம் திருக்கோயில்",
  "Temple Speciality": "கோயில் சிறப்புகள்",
  "Function Days & Festivals": "திருவிழா & விசேஷ நாட்கள்",
  "Function Days": "திருவிழா நாட்கள்",
  "Festival Function Days": "திருவிழா விசேஷ நாட்கள்",
  "Veda Parayana": "வேத பாராயணம்",
  "Veda Parayanam": "வேத பாராயணம்",
  "Krishna Yajur Veda": "கிருஷ்ண யஜுர் வேதம்",
  "Gallery": "புகைப்படங்கள்",
  "Photo Gallery": "புகைப்பட தொகுப்பு",
  "Temple Photo Gallery": "திருக்கோயில் புகைப்படங்கள்",
  "Online Seva Booking": "ஆன்லைன் சேவை முன்பதிவு",
  "E-Hundi / Donate": "இ-உண்டியல் / நன்கொடை",
  "E-Hundi": "இ-உண்டியல்",
  "E-Hundi Donation": "இ-உண்டியல் நன்கொடை",
  "Contact": "தொடர்பு",
  "Contact & Travel": "தொடர்பு & பயண வழிகாட்டி",

  // Top Bar & Utility
  "Sri Nataraja Sahasranamam": "ஸ்ரீ நடராஜர் சஹஸ்ரநாமம்",
  "Listen to Sri Nataraja Sahasranamam": "ஸ்ரீ நடராஜர் சஹஸ்ரநாமம் கேட்க",
  "Playing: Sri Nataraja Sahasranamam": "ஒலிக்கிறது: ஸ்ரீ நடராஜர் சஹஸ்ரநாமம்",
  "Trust Helpline: 04144-222345": "அறக்கட்டளை உதவி: 9442090377",
  "Trust Helpline:": "அறக்கட்டளை உதவி:",
  "Skip Intro": "முகப்புக்கு செல்க",
  "Play": "ஒலிக்க",
  "Pause": "நிறுத்து",
  "Sound": "ஒலி",
  "Mute": "ஒலி நீக்கு",
  "WhatsApp": "வாட்ஸ்அப்",

  // Trustee & Office Information
  "Trust Administrative Office": "அறக்கட்டளை நிர்வாக அலுவலகம்",
  "K. SIVASUBRAMANIYA DEEKSHITHAR": "கே. சிவசுப்ரமணிய தீக்ஷிதர்",
  "K. Sivasubramaniya Deekshithar": "கே. சிவசுப்ரமணிய தீக்ஷிதர்",
  "S/o. S.S. KUNCHITHASARANA DEEKSHITHAR": "த/பெ. எஸ்.எஸ். குஞ்சிதசரண தீக்ஷிதர்",
  "S/o. S.S. Kunchithasarana Deekshithar": "த/பெ. எஸ்.எஸ். குஞ்சிதசரண தீக்ஷிதர்",
  "Sri Sabanayagar Koil Trustee & Pooja": "ஸ்ரீ சபாநாயகர் கோயில் அறங்காவலர் & பூஜை",
  "Sri Sabanayagar Koil Trustee & Pooja (Chidambaram Nataraja Temple)": "ஸ்ரீ சபாநாயகர் கோயில் அறங்காவலர் & பூஜை (சிதம்பரம் நடராஜர் திருக்கோயில்)",
  "SRI KRISHNA-YAJURVEDHA PARAYANA TRUST": "ஸ்ரீ கிருஷ்ண யஜுர்வேத பாராயண அறக்கட்டளை",
  "SRI KRISHNA YAJUR VEDA PARAYANA TRUST": "ஸ்ரீ கிருஷ்ண யஜுர்வேத பாராயண அறக்கட்டளை",
  "No. 30, A.R.N. Apartment, East Car Street, Chidambaram - 608 001.": "எண். 30, ஏ.ஆர்.என். அபார்ட்மென்ட், கிழக்கு ரத வீதி, சிதம்பரம் - 608 001.",
  "No.30, A.R.N. Apartment, East Car Street, Chidambaram - 608 001.": "எண். 30, ஏ.ஆர்.என். அபார்ட்மென்ட், கிழக்கு ரத வீதி, சிதம்பரம் - 608 001.",
  "Cell & WhatsApp:": "அலைபேசி & வாட்ஸ்அப்:",
  "GPay / Payments:": "கூகுள் பே / ஜிபே:",
  "Address": "முகவரி",
  "Office Timings:": "அலுவலக நேரம்:",
  "06:30 AM to 01:00 PM & 04:00 PM to 08:30 PM (All 7 Days)": "காலை 06:30 முதல் மதியம் 01:00 வரை & மாலை 04:00 முதல் இரவு 08:30 வரை (அனைத்து நாட்களும்)",

  // Common Headings & Badges
  "Quick Links": "முக்கிய இணைப்புகள்",
  "Temple Links": "திருக்கோயில் இணைப்புகள்",
  "Devotee Sevas": "பக்தர்கள் சேவைகள்",
  "Temple Timings": "திருக்கோயில் நேரங்கள்",
  "Official Portal Visitors:": "அதிகாரப்பூர்வ பார்வையாளர்கள்:",
  "Visitor Counter:": "பார்வையாளர்கள் எண்ணிக்கை:",
  "Sacred 1,000 Names • Thillai Natarajar": "புனித 1000 திருநாமங்கள் • தில்லை நடராஜர்",
  "All Rights Reserved.": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  "Online Seva Booking & E-Hundi": "ஆன்லைன் சேவை முன்பதிவு & இ-உண்டியல்",
  "Devotee E-Contribution Portal": "பக்தர்கள் மின்னணு பங்களிப்பு தளம்",
  "Giving is the Highest Dharma": "தானமே தலையாய தர்மம்",
  "Akasa Sthalam • Cosmic Center": "ஆகாய ஸ்தலம் • பிரபஞ்ச மையம்",
  "Vedas Are Root of All Righteousness": "வேதமே அனைத்து தர்மங்களின் வேர்",
  "Sacred Visual Gallery": "புனித புகைப்படத் தொகுப்பு",
  "Thillai Nataraja Kshetram, Chidambaram": "தில்லை நடராஜ க்ஷேத்திரம், சிதம்பரம்",
  "Print Receipt": "ரசீதை அச்சிடுக",
  "Close": "மூடுக"
};

function initLanguageTranslation() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('currentLangText');

  // Load Google Translate script dynamically in background
  if (!document.getElementById('google-translate-lib')) {
    const gtScript = document.createElement('script');
    gtScript.id = 'google-translate-lib';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ta,en',
        autoDisplay: false
      }, 'google_translate_element');
    };
  }

  // Check saved preference (defaults to English)
  const savedLang = localStorage.getItem('trust_site_lang') || 'en';
  applyLanguage(savedLang, false);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem('trust_site_lang') || 'en';
      const nextLang = current === 'en' ? 'ta' : 'en';
      applyLanguage(nextLang, true);
    });
  }
}

function applyLanguage(lang, triggerTranslate = false) {
  localStorage.setItem('trust_site_lang', lang);
  const langLabel = document.getElementById('currentLangText');
  const langToggleBtn = document.getElementById('langToggleBtn');

  if (lang === 'ta') {
    if (langLabel) langLabel.textContent = 'English';
    if (langToggleBtn) {
      langToggleBtn.title = 'Switch to English / ஆங்கிலத்திற்கு மாறுக';
      langToggleBtn.classList.add('lang-active');
    }
    translateDomToTamil();
    if (triggerTranslate) {
      setGoogleTranslateLanguage('ta');
    }
  } else {
    if (langLabel) langLabel.textContent = 'தமிழ்';
    if (langToggleBtn) {
      langToggleBtn.title = 'Switch to Tamil / தமிழுக்கு மாறுக';
      langToggleBtn.classList.remove('lang-active');
    }
    restoreDomToOriginal();
    if (triggerTranslate) {
      setGoogleTranslateLanguage('en');
    }
  }
}

function translateDomToTamil() {
  const elements = document.querySelectorAll('a, button, span, h1, h2, h3, h4, strong, div, p, li');
  elements.forEach(el => {
    // Only translate elements without child tags or specific text nodes
    if (el.children.length === 0 || (el.children.length === 1 && el.querySelector('i'))) {
      const text = el.textContent.trim();
      if (TAMIL_DICTIONARY[text]) {
        if (!el.getAttribute('data-orig-en')) {
          el.setAttribute('data-orig-en', text);
        }
        const icon = el.querySelector('i');
        if (icon) {
          el.innerHTML = icon.outerHTML + ' ' + TAMIL_DICTIONARY[text];
        } else {
          el.textContent = TAMIL_DICTIONARY[text];
        }
      }
    }
  });
}

function restoreDomToOriginal() {
  const elements = document.querySelectorAll('[data-orig-en]');
  elements.forEach(el => {
    const orig = el.getAttribute('data-orig-en');
    if (orig) {
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = icon.outerHTML + ' ' + orig;
      } else {
        el.textContent = orig;
      }
    }
  });
}

function setGoogleTranslateLanguage(targetLang) {
  // Set Google Translate cookie
  const cookieVal = targetLang === 'en' ? '/en/en' : '/en/ta';
  document.cookie = 'googtrans=' + cookieVal + '; path=/;';
  document.cookie = 'googtrans=' + cookieVal + '; domain=' + window.location.hostname + '; path=/;';

  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = targetLang;
    select.dispatchEvent(new Event('change'));
  } else {
    // If widget is loading, reload softly to apply cookie translation
    setTimeout(() => {
      const sel = document.querySelector('.goog-te-combo');
      if (sel) {
        sel.value = targetLang;
        sel.dispatchEvent(new Event('change'));
      }
    }, 400);
  }
}

