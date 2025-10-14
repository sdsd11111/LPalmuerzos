// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const menuToggle = document.getElementById('menuToggle');
    const closeMenuBtn = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    const menuCategoryBtns = document.querySelectorAll('.menu-category-btn');

    // Toggle sidebar menu
    function toggleMenu(open = null) {
        const isOpening = open === null ? !sidebar.classList.contains('translate-x-0') : open;
        
        if (isOpening) {
            // Open menu
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            sidebarOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            // Close menu
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Close all dropdowns when closing the menu
            closeAllDropdowns();
        }
    }

    // Close all dropdown menus
    function closeAllDropdowns() {
        document.querySelectorAll('.menu-subcategory').forEach(menu => {
            menu.classList.add('hidden');
            const btn = menu.previousElementSibling;
            if (btn && btn.classList.contains('menu-category-btn')) {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Toggle dropdown menu
    function toggleDropdown(button, dropdown) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const icon = button.querySelector('i');
        
        // Close all other dropdowns first
        if (!isExpanded) {
            closeAllDropdowns();
        }
        
        // Toggle current dropdown
        dropdown.classList.toggle('hidden');
        button.setAttribute('aria-expanded', String(!isExpanded));
        
        // Toggle icon
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    }

    // Event Listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Main menu dropdown
    if (menuDropdownBtn && menuDropdown) {
        menuDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(menuDropdownBtn, menuDropdown);
        });
    }

    // Category dropdowns
    menuCategoryBtns.forEach(btn => {
        const dropdown = btn.nextElementSibling;
        if (dropdown && dropdown.classList.contains('menu-subcategory')) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDropdown(btn, dropdown);
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            closeAllDropdowns();
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });
});
