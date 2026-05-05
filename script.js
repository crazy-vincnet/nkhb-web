document.addEventListener('DOMContentLoaded', () => {
    // --- State & Constants ---
    let lastFocusedElement = null;

    // --- I18n Logic ---
    const renderTrackList = (lang) => {
        const trackListContainer = document.getElementById('track-list');
        if (!trackListContainer) return;

        trackListContainer.innerHTML = '';
        audioTracks.forEach(track => {
            const btn = document.createElement('button');
            btn.className = 'track-btn';
            btn.dataset.trackId = track.id;
            btn.dataset.i18nKey = track.id;
            btn.textContent = translations[lang][track.id] || track[lang];
            btn.addEventListener('click', () => playTrack(track.id));
            trackListContainer.appendChild(btn);
        });

        // Update active state in list if a track is already playing
        const sampleAudio = document.getElementById('sample-audio');
        if (sampleAudio && sampleAudio.src && sampleAudio.src !== window.location.href) {
            const currentId = audioTracks.find(t => {
                try {
                    return new URL(sampleAudio.src).href === new URL(t.url).href;
                } catch (e) {
                    return sampleAudio.src === t.url;
                }
            })?.id;

            if (currentId) {
                document.querySelectorAll('.track-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.trackId === currentId);
                });
            }
        }
    };

    const playTrack = (trackId) => {
        const track = audioTracks.find(t => t.id === trackId);
        if (!track) return;

        const sampleAudio = document.getElementById('sample-audio');
        const currentTrackTitle = document.getElementById('current-track-title');
        const lang = document.documentElement.lang || 'ko';

        if (sampleAudio) {
            sampleAudio.src = track.url;
            sampleAudio.play();
        }

        if (currentTrackTitle) {
            currentTrackTitle.textContent = translations[lang][track.id] || track[lang];
        }

        // Update active state
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.trackId === trackId);
        });
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        
        // Update document title and description
        if (translations[lang]) {
            if (translations[lang].page_title) document.title = translations[lang].page_title;
            
            // Meta Description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && translations[lang].meta_description) {
                metaDesc.setAttribute('content', translations[lang].meta_description);
            }

            // OpenGraph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle && translations[lang].page_title) ogTitle.setAttribute('content', translations[lang].page_title);
            
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc && translations[lang].meta_description) ogDesc.setAttribute('content', translations[lang].meta_description);
        }

        // Update text content
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Update alt attributes
        document.querySelectorAll('[data-i18n-alt]').forEach(img => {
            const key = img.getAttribute('data-i18n-alt');
            if (translations[lang] && translations[lang][key]) {
                img.alt = translations[lang][key];
            }
        });

        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (translations[lang] && translations[lang][key]) {
                el.setAttribute('aria-label', translations[lang][key]);
            }
        });

        // Update track list labels
        renderTrackList(lang);

        // Update current track title if visible
        const currentTrackTitle = document.getElementById('current-track-title');
        const sampleAudio = document.getElementById('sample-audio');
        if (currentTrackTitle && sampleAudio && sampleAudio.src && sampleAudio.src !== window.location.href) {
            const currentTrack = audioTracks.find(t => {
                try {
                    return new URL(sampleAudio.src).href === new URL(t.url).href;
                } catch (e) {
                    return sampleAudio.src === t.url;
                }
            });
            if (currentTrack) {
                currentTrackTitle.textContent = translations[lang][currentTrack.id] || currentTrack[lang];
            }
        }

        // Save to localStorage
        try {
            localStorage.setItem('nkhb_lang', lang);
        } catch (e) { }

        // Update active class on language switcher
        const currentActive = document.querySelector('.lang-selector a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        const newActiveLink = document.querySelector(`.lang-selector a[data-lang="${lang}"]`);
        if (newActiveLink) {
            newActiveLink.classList.add('active');
        }

        // Handle Title Font Size based on language
        const heroTitle = document.querySelector('[data-i18n-key="hero_title"]');
        if (heroTitle) {
            if (lang === 'en') {
                heroTitle.classList.add('hero-title-en');
            } else {
                heroTitle.classList.remove('hero-title-en');
            }
        }

        // Toggle Support Sections
        const koreanSupport = document.getElementById('support');
        const englishSupport = document.getElementById('support-en');
        if (lang === 'en') {
            if (koreanSupport) koreanSupport.style.display = 'none';
            if (englishSupport) englishSupport.style.display = 'block';
        } else {
            if (koreanSupport) koreanSupport.style.display = 'block';
            if (englishSupport) englishSupport.style.display = 'none';
        }

        // Update internal links to persist language safely
        document.querySelectorAll('a').forEach(a => {
            let href = a.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
                if (href.startsWith('#')) return;

                // Remove existing lang param if any
                href = href.replace(/([?&])lang=(en|ko)(&|$)/, '$1').replace(/[?&]$/, '');

                if (lang === 'en') {
                    const separator = href.includes('?') ? '&' : '?';
                    const hashIndex = href.indexOf('#');
                    if (hashIndex !== -1) {
                        href = href.slice(0, hashIndex) + separator + 'lang=en' + href.slice(hashIndex);
                    } else {
                        href += separator + 'lang=en';
                    }
                }
                a.setAttribute('href', href);
            }
        });

        // Point Donate nav to the visible support section for the current language
        const supportNavLink = document.querySelector('.nav-links a[data-i18n-key="nav_support"]');
        if (supportNavLink) {
            supportNavLink.setAttribute('href', lang === 'en' ? '#support-en' : '#support');
        }
    };

    const detectInitialLang = () => {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get('lang');
        if (langParam === 'en' || langParam === 'ko') {
            return langParam;
        }

        const path = window.location.pathname.toLowerCase();
        if (/(^|\/)en(\/|$)/.test(path)) return 'en';

        try {
            const savedLang = localStorage.getItem('nkhb_lang');
            if (savedLang === 'ko' || savedLang === 'en') {
                return savedLang;
            }
        } catch (e) { }

        if (window.location.hash.toLowerCase() === '#en') return 'en';
        return 'ko';
    };

    const updateUrlForLang = (lang) => {
        if (!window.history || !window.history.replaceState) return;
        const url = new URL(window.location);
        if (lang === 'en') {
            url.searchParams.set('lang', 'en');
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState({}, '', url);
    };

    // --- Modal Focus Management ---
    const trapFocus = (e, modal) => {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            const closeBtn = modal.querySelector('.close-modal, .close-modal-article, .close-modal-sample');
            if (closeBtn) closeBtn.click();
        }
    };

    const openModal = (modal) => {
        lastFocusedElement = document.activeElement;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first element or close button
        const first = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (first) setTimeout(() => first.focus(), 100);

        // Add focus trap listener
        modal._trapFocusListener = (e) => trapFocus(e, modal);
        document.addEventListener('keydown', modal._trapFocusListener);
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove focus trap listener
            if (modal._trapFocusListener) {
                document.removeEventListener('keydown', modal._trapFocusListener);
            }

            // Restore focus
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
    };

    // --- Event Listeners ---
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
        langSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.lang) {
                e.preventDefault();
                const lang = e.target.dataset.lang;
                setLanguage(lang);
                updateUrlForLang(lang);
                if (navContainer && navContainer.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    }

    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');

    const toggleMenu = () => {
        if (menuBtn && navContainer) {
            menuBtn.classList.toggle('active');
            navContainer.classList.toggle('active');
            document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
        }
    };

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navContainer && navContainer.classList.contains('active')) {
                    toggleMenu();
                }

                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Letter Modal
    const letterModal = document.getElementById('letter-modal');
    const openLetterBtn = document.getElementById('open-letter-modal');
    const closeLetterBtn = document.querySelector('.close-modal');
    const letterForm = document.getElementById('letter-form');

    if (openLetterBtn && letterModal) {
        openLetterBtn.addEventListener('click', () => openModal(letterModal));
    }
    if (closeLetterBtn) {
        closeLetterBtn.addEventListener('click', () => closeModal(letterModal));
    }
    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) closeModal(letterModal);
        });
    }

    // Article Modal
    const articleModal = document.getElementById('article-modal');
    const openArticleBtn = document.getElementById('open-article-modal');
    const closeArticleBtn = document.querySelector('.close-modal-article');

    if (openArticleBtn && articleModal) {
        openArticleBtn.addEventListener('click', () => openModal(articleModal));
    }
    if (closeArticleBtn) {
        closeArticleBtn.addEventListener('click', () => closeModal(articleModal));
    }
    if (articleModal) {
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) closeModal(articleModal);
        });
    }

    // Sample Listen Modal
    const sampleModal = document.getElementById('sample-modal');
    const openSampleBtn = document.getElementById('open-sample-modal');
    const closeSampleBtn = document.querySelector('.close-modal-sample');
    const sampleAudio = document.getElementById('sample-audio');

    if (openSampleBtn && sampleModal) {
        openSampleBtn.addEventListener('click', () => {
            openModal(sampleModal);
            if (!sampleAudio.src || sampleAudio.src === window.location.href || sampleAudio.src === '') {
                playTrack(audioTracks[0].id);
            }
        });
    }
    if (closeSampleBtn) {
        closeSampleBtn.addEventListener('click', () => {
            closeModal(sampleModal);
            if (sampleAudio) {
                sampleAudio.pause();
                sampleAudio.currentTime = 0;
            }
        });
    }
    if (sampleModal) {
        sampleModal.addEventListener('click', (e) => {
            if (e.target === sampleModal) {
                closeModal(sampleModal);
                if (sampleAudio) {
                    sampleAudio.pause();
                    sampleAudio.currentTime = 0;
                }
            }
        });
    }

    if (letterForm) {
        letterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnSubmit = letterForm.querySelector('.btn-submit');
            btnSubmit.disabled = true;
            btnSubmit.textContent = document.documentElement.lang === 'en' ? 'Sending...' : '전송 중...';

            const formData = new FormData(letterForm);
            const data = {
                name: formData.get('name'),
                location: formData.get('location'),
                reason: formData.get('reason'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            const scriptURL = 'https://script.google.com/macros/s/AKfycbyLZ3RwYgeBpR4FLHaKhBiJnuZK9ZRmpOCCF3-axwAiWPXjJwZg1iYy-CG9CFoyCuBx/exec';

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                body: JSON.stringify(data)
            })
                .then(() => {
                    const msg = document.documentElement.lang === 'en' ? 'Letter sent successfully.' : '편지가 성공적으로 전송되었습니다.';
                    alert(msg);
                    closeModal(letterModal);
                    letterForm.reset();
                })
                .catch(error => {
                    const msg = document.documentElement.lang === 'en' ? 'Failed to send. Please try again.' : '전송에 실패했습니다. 다시 시도해주세요.';
                    alert(msg);
                    console.error('Error!', error);
                })
                .finally(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = document.documentElement.lang === 'en' ? 'Send Letter' : '편지 보내기';
                });
        });
    }

    // Set initial language on page load
    setLanguage(detectInitialLang());
});
