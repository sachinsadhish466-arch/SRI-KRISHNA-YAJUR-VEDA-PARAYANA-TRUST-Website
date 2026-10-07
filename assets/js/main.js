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

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = nav.classList.toggle('show');
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (isExpanded) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains('show')) {
      nav.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });

  // Close when clicking any nav link
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      nav.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
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
    devotionalAudio = new Audio('assets/audio/sri-nataraja-sahasranamam.mp3?v=2');
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
  const tamilMonthEl = document.getElementById('panchangTamilMonth');
  const thithiEl = document.getElementById('panchangThithi');
  const nakshatramEl = document.getElementById('panchangNakshatram');
  const rahuKalamEl = document.getElementById('panchangRahuKalam');
  const nextDarshanEl = document.getElementById('panchangNextDarshan');

  function calculatePanchangam(now) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours() + now.getMinutes() / 60.0 + now.getSeconds() / 3600.0;
    
    // Julian Day Calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const jd = jdn + (hour - 12.0) / 24.0;
    const d = jd - 2451545.0; // days since J2000.0

    const rad = Math.PI / 180.0;

    // Solar Ephemeris
    const L0 = 280.46646 + 0.98564736 * d;
    const M_sun = 357.52911 + 0.98560028 * d;
    const C_sun = 1.914602 * Math.sin(M_sun * rad) + 0.019993 * Math.sin(2 * M_sun * rad);
    const sun_true_lon = (L0 + C_sun) % 360;

    // Lunar Ephemeris
    const L_moon = 218.3165 + 13.176396 * d;
    const M_moon = 134.9634 + 13.064993 * d;
    const D_moon = 297.8502 + 12.190749 * d;

    const moon_true_lon = (L_moon
      + 6.289 * Math.sin(M_moon * rad)
      - 1.274 * Math.sin((M_moon - 2 * D_moon) * rad)
      + 0.658 * Math.sin(2 * D_moon * rad)
      - 0.186 * Math.sin(M_sun * rad)
      - 0.059 * Math.sin((2 * M_moon - 2 * D_moon) * rad)
    ) % 360;

    // Ayanamsha (Lahiri ~24.12 deg)
    const ayanamsha = 23.85 + (year - 2000) * 0.01397 + (month / 12.0) * 0.01397;
    const sun_sidereal = ((sun_true_lon - ayanamsha) % 360 + 360) % 360;
    const moon_sidereal = ((moon_true_lon - ayanamsha) % 360 + 360) % 360;

    // Tithi
    const elongation = ((moon_true_lon - sun_true_lon) % 360 + 360) % 360;
    const tithi_index = Math.floor(elongation / 12.0) % 30;

    const tithi_names = [
      'Shukla Prathama', 'Shukla Dwitiya', 'Shukla Tritiya', 'Shukla Chaturthi', 'Shukla Panchami',
      'Shukla Sashti', 'Shukla Saptami', 'Shukla Ashtami', 'Shukla Navami', 'Shukla Dashami',
      'Shukla Ekadashi', 'Shukla Dwadashi', 'Shukla Trayodashi', 'Shukla Chaturdashi', 'Pournami (Full Moon)',
      'Krishna Prathama', 'Krishna Dwitiya', 'Krishna Tritiya', 'Krishna Chaturthi (Sankashti)', 'Krishna Panchami',
      'Krishna Sashti', 'Krishna Saptami', 'Krishna Ashtami', 'Krishna Navami', 'Krishna Dashami',
      'Krishna Ekadashi', 'Krishna Dwadashi', 'Krishna Trayodashi', 'Krishna Chaturdashi', 'Amavasya (New Moon)'
    ];

    // Nakshatram
    const nakshatra_index = Math.floor(moon_sidereal / (360.0 / 27.0)) % 27;
    const nakshatra_names = [
      'Ashwini (அசுவினி)', 'Bharani (பரணி)', 'Krittika (கார்த்திகை)', 'Rohini (ரோகிணி)', 'Mrigashirsha (மிருகசீரிடம்)',
      'Thiruvathirai (திருவாதிரை - Arudra)', 'Punarvasu (புனர்பூசம்)', 'Pushya (பூசம்)', 'Ashlesha (ஆயில்யம்)', 'Magha (மகம்)',
      'Purva Phalguni (பூரம்)', 'Uttara Phalguni (உத்திரம்)', 'Hasta (அஸ்தம்)', 'Chitra (சித்திரை)', 'Swati (சுவாதி)',
      'Vishakha (விசாகம்)', 'Anuradha (அனுஷம்)', 'Jyeshtha (கேட்டை)', 'Mula (மூலம்)', 'Purva Ashadha (பூராடம்)',
      'Uttara Ashadha (உத்திராடம்)', 'Shravana (திருவோணம்)', 'Dhanishta (அவிட்டம்)', 'Shatabhisha (சதயம்)',
      'Purva Bhadrapada (பூரட்டாதி)', 'Uttara Bhadrapada (உத்திரட்டாதி)', 'Revati (ரேவதி)'
    ];

    // Tamil Month
    const tamil_months = [
      'Chithirai (சித்திரை)', 'Vaikasi (வைகாசி)', 'Aani (ஆனி)', 'Aadi (ஆடி)',
      'Avani (ஆவணி)', 'Purattasi (புரட்டாசி)', 'Aippasi (ஐப்பசி)', 'Karthigai (கார்த்திகை)',
      'Margazhi (மார்கழி)', 'Thai (தை)', 'Maasi (மாசி)', 'Panguni (பங்குனி)'
    ];
    const tamil_month_index = Math.floor(sun_sidereal / 30.0) % 12;
    const tamil_day = Math.floor(sun_sidereal % 30.0) + 1;

    // Rahu Kalam by day of week
    const rahu_kalam_schedule = [
      '04:30 PM – 06:00 PM', // Sun
      '07:30 AM – 09:00 AM', // Mon
      '03:00 PM – 04:30 PM', // Tue
      '12:00 PM – 01:30 PM', // Wed
      '01:30 PM – 03:00 PM', // Thu
      '10:30 AM – 12:00 PM', // Fri
      '09:00 AM – 10:30 AM'  // Sat
    ];
    const rahuKalam = rahu_kalam_schedule[now.getDay()];

    // Next Special Darshan tracker (Chidambaram Aru Kaala Pooja Timings)
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let nextDarshan = 'Kala Santhi Pooja (06:00 AM)';
    if (currentMinutes < 6 * 60) {
      nextDarshan = 'Kala Santhi Pooja (06:00 AM)';
    } else if (currentMinutes < 7 * 60 + 30) {
      nextDarshan = 'Kala Santhi & Sphatika Lingam (Ongoing)';
    } else if (currentMinutes < 8 * 60 + 30) {
      nextDarshan = 'Irandam Kalam Pooja (08:30 AM)';
    } else if (currentMinutes < 9 * 60 + 30) {
      nextDarshan = 'Irandam Kalam & Veda Parayana (Ongoing)';
    } else if (currentMinutes < 11 * 60 + 30) {
      nextDarshan = 'Uchikala Pooja & Ruby Nataraja (11:30 AM)';
    } else if (currentMinutes < 12 * 60 + 30) {
      nextDarshan = 'Ratnasabhapati Ruby Abhishekam (Ongoing)';
    } else if (currentMinutes < 16 * 60 + 30) {
      nextDarshan = 'Evening Reopening (04:30 PM) / Sayaratchai (05:30 PM)';
    } else if (currentMinutes < 17 * 60 + 30) {
      nextDarshan = 'Sayaratchai Pooja (05:30 PM)';
    } else if (currentMinutes < 18 * 60 + 30) {
      nextDarshan = 'Sayaratchai & Rahasyam Darshan (Ongoing)';
    } else if (currentMinutes < 19 * 60 + 30) {
      nextDarshan = 'Night Irandam Kalam (07:30 PM)';
    } else if (currentMinutes < 20 * 60 + 30) {
      nextDarshan = 'Night Irandam Kalam Pooja (Ongoing)';
    } else if (currentMinutes < 21 * 60 + 30) {
      nextDarshan = 'Ardha Jamam Pooja (09:30 PM)';
    } else if (currentMinutes < 22 * 60) {
      nextDarshan = 'Ardha Jamam Paduka Procession (Ongoing)';
    } else {
      nextDarshan = 'Kala Santhi Pooja (Tomorrow 06:00 AM)';
    }

    return {
      tamilMonth: `${tamil_months[tamil_month_index]} - Day ${tamil_day}`,
      thithi: tithi_names[tithi_index],
      nakshatram: nakshatra_names[nakshatra_index],
      rahuKalam: rahuKalam,
      nextDarshan: nextDarshan
    };
  }

  function updateLivePanchangam() {
    const now = new Date();

    // Update Top Utility Bar Live Clock
    if (clockEl) {
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

    // Update Panchangam ticker items
    const panchang = calculatePanchangam(now);
    if (tamilMonthEl) tamilMonthEl.textContent = panchang.tamilMonth;
    if (thithiEl) thithiEl.textContent = panchang.thithi;
    if (nakshatramEl) nakshatramEl.textContent = panchang.nakshatram;
    if (rahuKalamEl) rahuKalamEl.textContent = panchang.rahuKalam;
    if (nextDarshanEl) nextDarshanEl.textContent = panchang.nextDarshan;
  }

  updateLivePanchangam();
  setInterval(updateLivePanchangam, 1000);
}

/* ==========================================================================
   ONLINE SEVA & E-HUNDI INTERACTIVE MODAL & RECEIPT GENERATOR
   ========================================================================== */
/* ==========================================================================
   ONLINE SEVA, GOPURAM SELECTION & PAYMENT GATEWAY INTEGRATION
   ========================================================================== */
const SEVA_DETAILS_DICTIONARY = {
  "Nitya Krishna Yajur Veda Parayanam": {
    name: "Nitya Krishna Yajur Veda Parayanam",
    shortName: "Nitya Veda Parayanam",
    baseAmount: 1008,
    rateLabel: "₹ 1,008 / day",
    elaborated: "Sacred continuous daily recitation of the Krishna Yajur Veda (Taittiriya Samhita, Padam, Krama, and Ghana chanting) by learned Vedic scholars at the Kanaka Sabha before Lord Nataraja. Morning Sankalpam is performed in your family's Gothram and Janma Nakshatram for Ayush, Arogya, and Aiswaryam."
  },
  "Monthly Prasatham - Personal Sankalpam & Home Delivery": {
    name: "Monthly Prasatham - Personal Sankalpam & Home Delivery",
    shortName: "Monthly Prasatham",
    baseAmount: 5000,
    rateLabel: "₹ 5,000",
    elaborated: "Personal Sankalpam Archanai performed each month on your Janma Nakshatram or monthly Pradosham at the sacred sanctum of Lord Nataraja. Blessed Thiruneeru (holy ash), Kungumam, and sacred temple Rakshai consecrated at Chit Sabha are dispatched directly to your registered residence."
  },
  "Annadanam Seva - Full Day Free Meals for Pilgrims": {
    name: "Annadanam Seva - Full Day Free Meals for Pilgrims",
    shortName: "Annadanam Seva",
    baseAmount: 30000,
    rateLabel: "Starting ₹ 30,000 / day",
    elaborated: "Sponsor a complete day of sacred Annadanam feeding hundreds of visiting devotees, pilgrims, sadhus, and Vedic vidyarthies at Chidambaram. Donors receive sacred Kovil Malai (temple garland), Pattu Thundu (sacred silk angavastram), and special Maha Prasatham."
  },
  "Special Annadhanam Seva - Full Day Free Meals for Pilgrims": {
    name: "Special Annadhanam Seva - Full Day Free Meals for Pilgrims",
    shortName: "Special Annadhanam Seva",
    baseAmount: 30000,
    rateLabel: "₹ 30,000 / day",
    elaborated: "Sponsor a complete day of sacred Annadanam feeding thousands of visiting devotees, pilgrims, sadhus, and Vedic vidyarthies at Chidambaram. Donors receive sacred Kovil Malai (temple garland), Pattu Thundu (sacred silk angavastram), and special Maha Prasatham."
  },
  "Annadhanam Seva (Custom Amount)": {
    name: "Annadhanam Seva (Devotee's Offering)",
    shortName: "Annadhanam Seva",
    baseAmount: 1,
    rateLabel: "Any Amount (Devotee's Wish)",
    elaborated: "Sacred Annadhanam donation at Chidambaram. Devotees are welcome to contribute any amount of their choice with no minimum limit — pay how much ever you wish towards feeding visiting pilgrims, sadhus, and Vedic vidyarthies."
  },
  "Annadhanam Seva": {
    name: "Annadhanam Seva (Devotee's Offering)",
    shortName: "Annadhanam Seva",
    baseAmount: 1,
    rateLabel: "Any Amount (Devotee's Wish)",
    elaborated: "Sacred Annadhanam donation at Chidambaram. Devotees are welcome to contribute any amount of their choice with no minimum limit — pay how much ever you wish towards feeding visiting pilgrims, sadhus, and Vedic vidyarthies."
  },
  "மஹா ருத்ர அபிஷேகம் (Maha Rudra Abhishekam)": {
    name: "மஹா ருத்ர அபிஷேகம் (Maha Rudra Abhishekam)",
    shortName: "மஹா ருத்ர அபிஷேகம்",
    baseAmount: 150000,
    rateLabel: "₹ 1,50,000",
    elaborated: "The most sacred and grand Maha Rudra Parayanam & Ekadasa Rudra Abhishekam chanted by learned Vedic scholars before Lord Nataraja and the Kanaka Sabha Sphatika Lingam. Bestows supreme health, prosperity, longevity, and removes all planetary afflictions."
  },
  "Moksha Deepam - Lamp Lighting on Gopuram for Pitru Tithi": {
    name: "Moksha Deepam - Lamp Lighting on Gopuram for Pitru Tithi",
    shortName: "Moksha Deepam",
    baseAmount: 5000,
    rateLabel: "₹ 5,000 per Gopuram",
    elaborated: "Auspicious ghee lamp (Akhanda Moksha Deepam) lit atop the sacred Raja Gopurams of Chidambaram on your ancestors' Pitru Tithi or Amavasya. Sponsoring brings eternal liberation and peace to ancestral souls. Choose North, South, East, or West Gopuram (₹ 5,000 each; ₹ 20,000 for all 4)."
  },
  "Runavimochana Lingam Abhishekam (Debt Relief)": {
    name: "Runavimochana Lingam Abhishekam (Debt Relief)",
    shortName: "Runavimochana Lingam",
    baseAmount: 10000,
    rateLabel: "₹ 10,000",
    elaborated: "Special 11-dravya Maha Abhishekam to the sacred Runavimochana Lingam inside the temple complex. Specifically performed to dissolve financial burdens, karmic debts, past-life encumbrances, and bestow financial freedom and peace of mind."
  },
  "Chandramouleeswarar Abhishekam (Kanaka Sabha 6-Kaala)": {
    name: "Chandramouleeswarar Abhishekam (Kanaka Sabha 6-Kaala)",
    shortName: "Chandramouleeswarar",
    baseAmount: 25000,
    rateLabel: "₹ 25,000",
    elaborated: "Exclusive 6-Kaala sacred Abhishekam to the legendary Sphatika (pure quartz crystal) Lingam of Lord Chandramouleeswarar consecrated by Adi Shankaracharya. Performed at the Kanaka Sabha before Lord Nataraja with milk, honey, sandalwood, and rosewater."
  }
};

function initDonationModal() {
  const sevaButtons = document.querySelectorAll('.seva-option-btn');
  const sevaAmountInput = document.getElementById('donationAmount');
  const selectedSevaInput = document.getElementById('selectedSevaName');
  const donationForm = document.getElementById('onlineSevaForm');
  const gopuramContainer = document.getElementById('gopuramSelectionContainer');
  const gopuramCheckboxes = document.querySelectorAll('.gopuram-checkbox');
  const gopuramTotalDisplay = document.getElementById('gopuramTotalDisplay');
  const liveDescTitle = document.getElementById('liveDescTitle');
  const liveDescText = document.getElementById('liveDescText');
  const minAmountDisplay = document.getElementById('minAmountDisplay');

  // Category Tabs
  const categoryTabs = document.querySelectorAll('.seva-category-tab');
  const vedaSevaGrid = document.getElementById('vedaSevaGrid');
  const annadhanamSevaGrid = document.getElementById('annadhanamSevaGrid');
  const selectedCategoryInput = document.getElementById('selectedCategory');
  const sevaOfferingsLabel = document.getElementById('sevaOfferingsLabel');
  const addressSection = document.getElementById('addressSection');
  const devoteeAddressInput = document.getElementById('devoteeAddress');

  let currentMinAmount = 1008;
  let activeSelectedSeva = "Nitya Krishna Yajur Veda Parayanam";

  // Function to toggle Postal Address section (hidden for Nitya Veda Parayanam, included for all other options)
  function updateAddressVisibility(sevaName) {
    if (!addressSection) return;
    const isNitya = (sevaName || '').toLowerCase().includes('nitya');
    if (isNitya) {
      addressSection.style.display = 'none';
      if (devoteeAddressInput) {
        devoteeAddressInput.required = false;
      }
    } else {
      addressSection.style.display = 'block';
      if (devoteeAddressInput) {
        devoteeAddressInput.required = true;
      }
    }
  }

  // Function to update the live description box
  function updateLiveDescription(sevaKey) {
    const details = SEVA_DETAILS_DICTIONARY[sevaKey];
    if (details && liveDescTitle && liveDescText) {
      liveDescTitle.innerHTML = `<i class="fas fa-om" style="color: var(--saffron-warm);"></i> ${details.name} &mdash; ${details.rateLabel}`;
      liveDescText.textContent = details.elaborated;
    }
  }

  // Bind Category Tabs (Veda Seva & Sankalpam vs Annadhanam Seva)
  if (categoryTabs.length) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-category');
        if (selectedCategoryInput) {
          selectedCategoryInput.value = cat === 'annadhanam-seva' ? 'Annadhanam Seva' : 'Veda Seva & Sankalpam';
        }

        if (cat === 'annadhanam-seva') {
          if (vedaSevaGrid) vedaSevaGrid.style.display = 'none';
          if (annadhanamSevaGrid) annadhanamSevaGrid.style.display = 'grid';
          if (gopuramContainer) gopuramContainer.style.display = 'none';
          if (sevaOfferingsLabel) sevaOfferingsLabel.textContent = 'Select Annadhanam Seva Offering:';

          const firstAnnadhanamBtn = annadhanamSevaGrid ? annadhanamSevaGrid.querySelector('.seva-option-btn') : null;
          if (firstAnnadhanamBtn) {
            firstAnnadhanamBtn.click();
          }
        } else {
          if (annadhanamSevaGrid) annadhanamSevaGrid.style.display = 'none';
          if (vedaSevaGrid) vedaSevaGrid.style.display = 'grid';
          if (sevaOfferingsLabel) sevaOfferingsLabel.textContent = 'Select Divine Seva:';

          const firstVedaBtn = vedaSevaGrid ? vedaSevaGrid.querySelector('.seva-option-btn') : null;
          if (firstVedaBtn) {
            firstVedaBtn.click();
          }
        }
      });
    });
  }

  // Function to calculate Gopuram selection total
  function calculateGopuramTotal() {
    if (!gopuramCheckboxes.length) return 5000;
    const checkedBoxes = Array.from(gopuramCheckboxes).filter(cb => cb.checked);
    let count = checkedBoxes.length;
    
    // Ensure at least 1 Gopuram remains selected
    if (count === 0) {
      const defaultBox = document.getElementById('gopuramNorth') || gopuramCheckboxes[0];
      if (defaultBox) defaultBox.checked = true;
      count = 1;
    }

    const total = count * 5000;
    currentMinAmount = total;

    if (sevaAmountInput) {
      sevaAmountInput.min = currentMinAmount;
      sevaAmountInput.value = total;
    }

    if (minAmountDisplay) {
      minAmountDisplay.textContent = currentMinAmount.toLocaleString('en-IN');
    }

    if (gopuramTotalDisplay) {
      gopuramTotalDisplay.textContent = '₹ ' + total.toLocaleString('en-IN') + (count === 4 ? ' (All 4 Gopurams)' : ` (${count} Gopuram${count > 1 ? 's' : ''})`);
    }

    return total;
  }

  // Bind Gopuram Checkbox Changes
  if (gopuramCheckboxes.length) {
    gopuramCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        calculateGopuramTotal();
      });
    });
  }

  // Bind Seva Option Buttons
  if (sevaButtons.length && sevaAmountInput) {
    sevaButtons.forEach(btn => {
      const sevaName = btn.getAttribute('data-name');
      const baseAmount = parseInt(btn.getAttribute('data-amount'), 10) || 1008;

      // Hover: show elaborated details on cursor arrow hover
      btn.addEventListener('mouseenter', () => {
        updateLiveDescription(sevaName);
      });

      // Mouse leave: restore selected seva details
      btn.addEventListener('mouseleave', () => {
        updateLiveDescription(activeSelectedSeva);
      });

      // Click: Select Seva
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sevaButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        activeSelectedSeva = sevaName;
        if (selectedSevaInput) selectedSevaInput.value = sevaName;
        updateLiveDescription(sevaName);

        // Check if Moksha Deepam is chosen
        if (sevaName.includes('Moksha Deepam')) {
          if (gopuramContainer) gopuramContainer.style.display = 'block';
          calculateGopuramTotal();
          const amountNotice = document.getElementById('amountNoticeContent');
          if (amountNotice) {
            amountNotice.innerHTML = `<i class="fas fa-info-circle"></i> The amount shown is calculated for selected Gopurams. (Minimum: ₹ <span id="minAmountDisplay">${currentMinAmount.toLocaleString('en-IN')}</span>)`;
          }
        } else if (baseAmount === 1 || sevaName.includes('Custom Amount') || sevaName === 'Annadhanam Seva') {
          // Annadhanam Seva: NO minimum restriction — devotees can pay how much ever they want
          if (gopuramContainer) gopuramContainer.style.display = 'none';
          currentMinAmount = 1;
          sevaAmountInput.min = 1;
          const defaultVal = parseInt(btn.getAttribute('data-default'), 10) || 500;
          sevaAmountInput.value = defaultVal;
          const amountNotice = document.getElementById('amountNoticeContent');
          if (amountNotice) {
            amountNotice.innerHTML = `<i class="fas fa-hand-holding-heart" style="color: var(--crimson-main);"></i> Devotees can pay <strong>how much ever they want</strong> &mdash; <strong>no minimum amount restriction</strong>.`;
          }
          if (minAmountDisplay) {
            minAmountDisplay.textContent = '1';
          }
        } else {
          if (gopuramContainer) gopuramContainer.style.display = 'none';
          currentMinAmount = baseAmount;
          sevaAmountInput.min = currentMinAmount;
          sevaAmountInput.value = baseAmount;
          const amountNotice = document.getElementById('amountNoticeContent');
          if (amountNotice) {
            amountNotice.innerHTML = `<i class="fas fa-info-circle"></i> The amount shown in this section is default but you can choose more amount as well. (Minimum: ₹ <span id="minAmountDisplay">${currentMinAmount.toLocaleString('en-IN')}</span>)`;
          }
          if (minAmountDisplay) {
            minAmountDisplay.textContent = currentMinAmount.toLocaleString('en-IN');
          }
        }

        // Toggle address section (hidden for Nitya, included for all other options)
        updateAddressVisibility(sevaName);
      });
    });

    // Enforce Non-reducing amount rule: amount can be increased, but CANNOT go less than default minimum (unless Annadhanam custom amount)
    sevaAmountInput.addEventListener('input', () => {
      const val = parseFloat(sevaAmountInput.value);
      if (currentMinAmount > 1 && val < currentMinAmount) {
        // User typed below minimum for fixed sevas; warn with red border
        sevaAmountInput.style.borderColor = 'red';
      } else if (val < 1 || isNaN(val)) {
        sevaAmountInput.style.borderColor = 'red';
      } else {
        sevaAmountInput.style.borderColor = 'var(--primary-gold)';
      }
    });

    sevaAmountInput.addEventListener('change', () => {
      const val = parseFloat(sevaAmountInput.value);
      if (currentMinAmount === 1) {
        // Devotee can pay how much ever they want
        if (isNaN(val) || val < 1) {
          sevaAmountInput.value = 100;
          sevaAmountInput.style.borderColor = 'var(--primary-gold)';
          alert('Please enter a valid offering amount (at least ₹ 1). Devotees can contribute any amount of their choice.');
        } else {
          sevaAmountInput.style.borderColor = 'var(--primary-gold)';
        }
      } else {
        if (isNaN(val) || val < currentMinAmount) {
          sevaAmountInput.value = currentMinAmount;
          sevaAmountInput.style.borderColor = 'var(--primary-gold)';
          alert(`The amount shown in this section is default but you can choose more amount as well. The amount cannot be reduced below the default minimum of ₹ ${currentMinAmount.toLocaleString('en-IN')}.`);
        }
      }
    });
  }

  // Handle Form Submission -> Redirect to Payment Gateway Page
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const devoteeName = document.getElementById('devoteeName')?.value?.trim() || 'Devotee';
      const devoteeGothram = document.getElementById('devoteeGothram')?.value?.trim() || '';
      const devoteeNakshatram = document.getElementById('devoteeNakshatram')?.value?.trim() || 'Thiruvathirai';
      const devoteePhone = document.getElementById('devoteePhone')?.value?.trim() || '';
      const devoteeAddress = document.getElementById('devoteeAddress')?.value?.trim() || '';
      const sevaName = selectedSevaInput?.value || activeSelectedSeva;
      
      let amount = parseFloat(sevaAmountInput?.value);
      if (currentMinAmount === 1) {
        if (isNaN(amount) || amount < 1) {
          amount = 100;
          if (sevaAmountInput) sevaAmountInput.value = amount;
        }
      } else {
        if (isNaN(amount) || amount < currentMinAmount) {
          amount = currentMinAmount;
          if (sevaAmountInput) sevaAmountInput.value = currentMinAmount;
        }
      }

      // Collect selected Gopurams if Moksha Deepam
      let selectedGopuramsList = [];
      if (sevaName.includes('Moksha Deepam') && gopuramCheckboxes.length) {
        selectedGopuramsList = Array.from(gopuramCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
      }

      const bookingOrder = {
        name: devoteeName,
        phone: devoteePhone,
        gothram: devoteeGothram,
        nakshatram: devoteeNakshatram,
        address: devoteeAddress,
        sevaName: sevaName,
        gopurams: selectedGopuramsList.join(', '),
        gopuramCount: selectedGopuramsList.length,
        amount: amount,
        minAmount: currentMinAmount,
        receiptNo: 'SKYVPT-' + Math.floor(100000 + Math.random() * 900000),
        bookingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      // Store in Session Storage for payment page retrieval
      try {
        sessionStorage.setItem('pendingSevaBooking', JSON.stringify(bookingOrder));
      } catch (err) {
        console.warn('sessionStorage error:', err);
      }

      // Construct redirect URL to Payment Page with query parameters as reliable backup
      const params = new URLSearchParams({
        name: devoteeName,
        phone: devoteePhone,
        gothram: devoteeGothram,
        nakshatram: devoteeNakshatram,
        seva: sevaName,
        amount: amount,
        gopurams: selectedGopuramsList.join(', '),
        receipt: bookingOrder.receiptNo
      });

      const isNitya = (sevaName || '').toLowerCase().includes('nitya');
      if (!isNitya && !devoteeAddress) {
        alert('Please enter your Postal Address for blessed Prasad and receipt dispatch.');
        document.getElementById('devoteeAddress')?.focus();
        return;
      }

      window.location.href = 'payment.html?' + params.toString();
    });
  }

  // Initial check for address section visibility on page load
  updateAddressVisibility(activeSelectedSeva);
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
  "Trust Helpline: 04144-222345": "அறக்கட்டளை உதவி: 9363949441",
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
  "Our Trusted Trustee": "நமது நம்பிக்கைக்குரிய அறங்காவலர்",
  "OUR TRUSTED TRUSTEE": "நமது நம்பிக்கைக்குரிய அறங்காவலர்",
  "Our Trusted Trustee (Chidambaram Nataraja Temple)": "நமது நம்பிக்கைக்குரிய அறங்காவலர் (சிதம்பரம் நடராஜர் திருக்கோயில்)",
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
    updateNavLanguage('ta');
    if (triggerTranslate) {
      setGoogleTranslateLanguage('ta');
    }
  } else {
    if (langLabel) langLabel.textContent = 'தமிழ்';
    if (langToggleBtn) {
      langToggleBtn.title = 'Switch to Tamil / தமிழுக்கு மாறுக';
      langToggleBtn.classList.remove('lang-active');
    }
    updateNavLanguage('en');
    if (triggerTranslate) {
      setGoogleTranslateLanguage('en');
    }
  }
}

const NAV_TRANSLATIONS = {
  'Home': 'முகப்பு',
  'Chidambaram Temple': 'சிதம்பரம் திருக்கோயில்',
  'Function Days & Festivals': 'திருவிழா & விசேஷ நாட்கள்',
  'Veda Parayanam': 'வேத பாராயணம்',
  'About Trust': 'அறக்கட்டளை பற்றி',
  'Photo Gallery': 'புகைப்பட தொகுப்பு',
  'Contact & Travel': 'தொடர்பு & வழிகாட்டி',
  'Online Seva Booking': 'ஆன்லைன் சேவை முன்பதிவு'
};

function updateNavLanguage(lang) {
  const links = document.querySelectorAll('.nav-link, .nav-btn-donate');
  links.forEach(a => {
    // Preserve original English text on the anchor element
    if (!a.getAttribute('data-nav-en')) {
      const clone = a.cloneNode(true);
      const icon = clone.querySelector('i');
      if (icon) icon.remove();
      a.setAttribute('data-nav-en', clone.textContent.trim());
    }

    const origEn = a.getAttribute('data-nav-en');
    const icon = a.querySelector('i');
    const iconHtml = icon ? icon.outerHTML + ' ' : '';

    if (lang === 'ta' && NAV_TRANSLATIONS[origEn]) {
      a.innerHTML = iconHtml + NAV_TRANSLATIONS[origEn];
    } else if (origEn) {
      a.innerHTML = iconHtml + origEn;
    }
  });
}

function setGoogleTranslateLanguage(targetLang) {
  // Set Google Translate cookie across root and host
  const cookieVal = targetLang === 'en' ? '/en/en' : '/en/ta';
  document.cookie = 'googtrans=' + cookieVal + '; path=/;';
  if (window.location.hostname) {
    document.cookie = 'googtrans=' + cookieVal + '; domain=' + window.location.hostname + '; path=/;';
  }

  function triggerCombo() {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  }

  if (!triggerCombo()) {
    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      if (triggerCombo() || retries >= 15) {
        clearInterval(interval);
      }
    }, 250);
  }
}

