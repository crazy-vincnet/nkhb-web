document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Mobile Menu Toggle
    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        navContainer.classList.toggle('active');
        document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Smooth scrolling & Auto-close menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close menu if open
                if (navContainer.classList.contains('active')) {
                    toggleMenu();
                }

                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Letter Modal Selectors
    const letterModal = document.getElementById('letter-modal');
    const openModalBtn = document.getElementById('open-letter-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const letterForm = document.getElementById('letter-form');

    // Open Modal
    openModalBtn.addEventListener('click', () => {
        letterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Modal
    const closeModal = () => {
        letterModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);

    // Close on background click
    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) closeModal();
    });

    // Form Submission to Google Sheets
    // IMPORTANT: Replace this URL after deploying Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5M34i7RHI40g3hn0NaB1hVZQPwQV_3m-fq-AlK_ZW1y4o0d3QoErhZTNGr9AXF4E/exec';

    letterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = letterForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerText;
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = '전송 중...';

        const formData = new FormData(letterForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // For testing without URL, show local alert
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                console.log('Form data ready:', data);
                alert('구글 앱스 스크립트 URL이 설정되지 않았습니다. (데이터는 콘솔에 기록됨)\n구글 시트 연동 설정을 완료해주세요!');
            } else {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Google Script requires no-cors often for simple posts
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                alert('희망의 편지가 성공적으로 발송되었습니다. 소중한 참여 감사합니다!');
            }
            
            letterForm.reset();
            closeModal();
        } catch (error) {
            console.error('Submission error:', error);
            alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    // Language selector toggle logic
    const langLinks = document.querySelectorAll('.lang-selector a');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            langLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
