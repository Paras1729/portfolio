/**
 * Modern Theme Toggle System
 * Supports dark/light mode with localStorage persistence
 */

class ThemeToggle {
    constructor() {
        this.isDarkMode = true; // Default to dark mode as requested
        this.toggleButton = null;
        this.toggleIcon = null;
        
        this.init();
    }
    
    init() {
        // Load saved theme preference or use default dark mode
        this.loadTheme();
        
        // Apply the theme immediately
        this.applyTheme();
        
        // Create toggle button when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createToggleButton());
        } else {
            this.createToggleButton();
        }
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        }
        // If no saved theme, default to dark mode (this.isDarkMode is already true)
    }
    
    saveTheme() {
        localStorage.setItem('portfolio-theme', this.isDarkMode ? 'dark' : 'light');
    }
    
    applyTheme() {
        const body = document.body;
        
        if (this.isDarkMode) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        
        // Update toggle icon if it exists
        this.updateToggleIcon();
        
        // Save preference
        this.saveTheme();
    }
    
    createToggleButton() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) {
            this.toggleButton = document.querySelector('.theme-toggle .toggle-switch');
            this.toggleIcon = document.querySelector('.theme-toggle .toggle-icon');
            this.attachEventListeners();
            this.updateToggleIcon();
            return;
        }
        
        // Create toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle';
        
        // Create toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'toggle-switch';
        this.toggleButton.setAttribute('aria-label', 'Toggle theme');
        this.toggleButton.setAttribute('title', this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
        
        // Create toggle slider with icon
        const toggleSlider = document.createElement('div');
        toggleSlider.className = 'toggle-slider';
        
        this.toggleIcon = document.createElement('span');
        this.toggleIcon.className = 'toggle-icon';
        
        toggleSlider.appendChild(this.toggleIcon);
        this.toggleButton.appendChild(toggleSlider);
        toggleContainer.appendChild(this.toggleButton);
        
        // Add to page
        document.body.appendChild(toggleContainer);
        
        // Update icon and attach events
        this.updateToggleIcon();
        this.attachEventListeners();
    }
    
    updateToggleIcon() {
        if (this.toggleIcon) {
            this.toggleIcon.textContent = this.isDarkMode ? '🌙' : '☀️';
        }
        
        if (this.toggleButton) {
            this.toggleButton.setAttribute('title', this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }
    
    attachEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if no manual preference is saved
                if (!localStorage.getItem('portfolio-theme')) {
                    this.isDarkMode = e.matches;
                    this.applyTheme();
                }
            });
        }
    }
    
    toggle() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        
        // Add a subtle animation feedback
        if (this.toggleButton) {
            this.toggleButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.toggleButton.style.transform = '';
            }, 150);
        }
    }
    
    // Public methods for external access
    setTheme(isDark) {
        this.isDarkMode = isDark;
        this.applyTheme();
    }
    
    getCurrentTheme() {
        return this.isDarkMode ? 'dark' : 'light';
    }
}

// Initialize theme toggle
const themeToggle = new ThemeToggle();

// Make it globally accessible
window.themeToggle = themeToggle;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
} 