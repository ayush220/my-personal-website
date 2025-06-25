/**
 * Theme Switcher for Dark/Light Mode
 * Handles theme switching and persistence using localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // If user has previously selected a theme, use that
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeToggle.checked = true;
        }
    } else if (prefersDarkScheme.matches) {
        // If no saved preference, but system prefers dark mode
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        localStorage.setItem('theme', 'dark');
    }
    
    // Listen for toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Dark mode
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            // Directly set testimonials section background
            const testimonialsSection = document.getElementById('testimonials-main-section');
            if (testimonialsSection) {
                testimonialsSection.style.backgroundColor = '#121212';
                testimonialsSection.style.color = '#f8f9fa';
            }
        } else {
            // Light mode
            
            // Reset testimonials section background
            const testimonialsSection = document.getElementById('testimonials-main-section');
            if (testimonialsSection) {
                testimonialsSection.style.backgroundColor = '';
                testimonialsSection.style.color = '';  
            }
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});
