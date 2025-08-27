// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Responsive design utilities
(function() {
    'use strict';
    
    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Ensure viewport height is correct on mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial viewport height
    setViewportHeight();
    
    // Update viewport height on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Prevent body scroll when modal is open
    function preventBodyScroll() {
        document.body.style.overflow = 'hidden';
    }
    
    function allowBodyScroll() {
        document.body.style.overflow = '';
    }
    
    // Handle Bootstrap modal events
    document.addEventListener('show.bs.modal', preventBodyScroll);
    document.addEventListener('hidden.bs.modal', allowBodyScroll);
    
    // Ensure content fits within viewport
    function adjustContentHeight() {
        const header = document.querySelector('.app-header');
        const footer = document.querySelector('.app-footer');
        const main = document.querySelector('.app-main');
        
        if (header && footer && main) {
            const headerHeight = header.offsetHeight;
            const footerHeight = footer.offsetHeight;
            const windowHeight = window.innerHeight;
            const availableHeight = windowHeight - headerHeight - footerHeight;
            
            main.style.height = `${availableHeight}px`;
        }
    }
    
    // Adjust content height on load and resize
    window.addEventListener('load', adjustContentHeight);
    window.addEventListener('resize', adjustContentHeight);
    
    // Handle mobile navigation collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Ensure navbar doesn't cause overflow
            setTimeout(adjustContentHeight, 100);
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 576) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Ensure images don't cause horizontal overflow
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            if (this.naturalWidth > window.innerWidth) {
                this.style.maxWidth = '100%';
                this.style.height = 'auto';
            }
        });
    });
    
})();

// Modern TechStore navbar işlevselliği
(function() {
    'use strict';
    
    // Viewport yüksekliğini ayarla
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // İlk yükleme
    setViewportHeight();
    
    // Pencere boyutu değiştiğinde
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Arama işlevselliği
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Önceki timeout'u temizle
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            if (query.length === 0) {
                searchResults.classList.remove('show');
                return;
            }
            
            // 300ms gecikme ile arama
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                e.preventDefault();
                window.location.href = `/search?query=${encodeURIComponent(this.value.trim())}`;
            }
        });
        
        // Arama sonuçları dışına tıklandığında kapat
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('show');
            }
        });
    }
    
    // Arama fonksiyonu
    async function performSearch(query) {
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                displaySearchResults(data);
            } else {
                searchResults.classList.remove('show');
            }
        } catch (error) {
            console.error('Arama hatası:', error);
            searchResults.classList.remove('show');
        }
    }
    
    // Arama sonuçlarını göster
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.classList.remove('show');
            return;
        }
        
        searchResults.innerHTML = results.map(item => `
            <div class="search-result-item" onclick="goToProduct(${item.id})">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 1.5rem;">📦</span>
                    </div>
                    <div style="flex: 1;">
                        <p style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0; text-align: left;">
                            ${item.isim || item.name}
                        </p>
                        <p style="font-size: 0.875rem; color: #7c3aed; font-weight: 700; margin: 0; text-align: left;">
                            ${item.fiyat} ₺
                        </p>
                    </div>
                    <div style="color: #7c3aed;">
                        <i class="fas fa-search" style="font-size: 1rem;"></i>
                    </div>
                </div>
            </div>
        `).join('');
        
        searchResults.classList.add('show');
    }
    
    // Ürün sayfasına git
    window.goToProduct = function(id) {
        window.location.href = `/product/${id}`;
    };
    
    // Favoriler ve sepet sayılarını güncelle
    function updateCounts() {
        // Favoriler sayısı
        const favoritesCount = document.getElementById('favoritesCount');
        if (favoritesCount) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            favoritesCount.textContent = favorites.length;
        }
        
        // Sepet sayısı
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Sayfa yüklendiğinde sayıları güncelle
    updateCounts();
    
    // Kullanıcı durumu kontrolü
    function checkUserStatus() {
        const userAccount = document.getElementById('userAccount');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (user && userAccount) {
            userAccount.innerHTML = `
                <div class="user-icon">
                    <i class="fas fa-user"></i>
                </div>
                <span class="user-text">${user.name}</span>
            `;
            
            // Kullanıcı menüsü ekle
            userAccount.addEventListener('click', function(e) {
                e.preventDefault();
                showUserMenu();
            });
        }
    }
    
    // Kullanıcı menüsünü göster
    function showUserMenu() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) return;
        
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.style.cssText = `
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 0.75rem;
            width: 14rem;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            border: 1px solid #e5e7eb;
            z-index: 1000;
        `;
        
        menu.innerHTML = `
            <div style="padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 0.75rem 0.75rem 0 0;">
                <p style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0; text-align: center;">
                    Hoşgeldin, ${user.name}
                </p>
                <p style="font-size: 0.75rem; color: #7c3aed; font-weight: 500; margin: 0; text-align: center;">
                    Müşteri
                </p>
            </div>
            <a href="/settings" style="display: block; padding: 0.75rem 1rem; font-size: 0.875rem; color: #374151; text-decoration: none; text-align: center; transition: all 0.3s ease;">
                ⚙️ Ayarlar
            </a>
            <div style="border-top: 1px solid #e5e7eb; margin: 0.5rem 0; padding-top: 0.5rem;">
                <button onclick="logout()" style="width: 100%; text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; color: #dc2626; background: none; border: none; cursor: pointer; transition: all 0.3s ease; border-radius: 0.5rem; margin: 0 0.5rem;">
                    🚪 Çıkış Yap
                </button>
            </div>
        `;
        
        const userAccount = document.getElementById('userAccount');
        if (userAccount) {
            userAccount.style.position = 'relative';
            userAccount.appendChild(menu);
            
            // Menü dışına tıklandığında kapat
            setTimeout(() => {
                document.addEventListener('click', function closeMenu(e) {
                    if (!userAccount.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }, 100);
        }
    }
    
    // Çıkış yap
    window.logout = function() {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };
    
    // Dropdown menü yönetimi
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Hover ile açma/kapama (desktop için)
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', function() {
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // Mobil menü yönetimi
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
        
        // Mobil menü linklerine tıklandığında menüyü kapat
        const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
            });
        });
    }
    
    // Sayfa yüklendiğinde kullanıcı durumunu kontrol et
    checkUserStatus();
    
    // LocalStorage değişikliklerini dinle
    window.addEventListener('storage', function(e) {
        if (e.key === 'favorites' || e.key === 'cart') {
            updateCounts();
        }
        if (e.key === 'user') {
            checkUserStatus();
        }
    });
    
    // Dropdown menü scrollbar stilleri
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-menu::-webkit-scrollbar {
            width: 6px;
        }
        .dropdown-menu::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        .search-results::-webkit-scrollbar {
            width: 6px;
        }
        .search-results::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        .search-results::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        .search-results::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;
    document.head.appendChild(style);
    
})();
