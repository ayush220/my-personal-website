// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value || 'Message from website';
            const message = document.getElementById('message').value;
            
            // Show sending status
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#6C63FF';
            
            // Send email using Email.js service
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };
            
            // EmailJS configuration
            emailjs.send('service_fe4qvxr', 'template_nipmwqm', templateParams, 'l_pp6ArA4M8facPzS')
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                    
                    // Redirect to thank you page after a short delay
                    setTimeout(function() {
                        window.location.href = 'thank-you.html';
                    }, 2000);
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    formStatus.textContent = 'Failed to send message. Please try again.';
                    formStatus.style.color = 'red';
                });
        });
    }
    
    // Add fixed header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});