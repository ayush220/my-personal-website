// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const testimonialContainer = document.getElementById('testimonial-container');
    const welcomeModal = document.getElementById('welcome-modal');
    const testimonialModal = document.getElementById('testimonial-modal');
    const closeWelcomeModal = document.querySelector('.close-welcome-modal');
    const closeModal = document.querySelector('.close-modal');
    const shareExperienceBtn = document.getElementById('share-experience-btn');
    const closeWelcomeBtn = document.querySelector('.close-welcome-btn');
    const testimonialForm = document.getElementById('testimonialForm');
    const formStatus = document.getElementById('form-status');
    
    // Sample testimonials data - this would be replaced by your actual data
    const testimonials = [
        {
            name: "Priyabrata Tripathy",
            position: "Senior Consultant",
            company: "Deloitte India (Offices of the US)",
            content: "Ayush is highly skilled in Java, having developed various libraries as well as complex modules for the project team and mentored junior developers in coding best practices. It was a pleasure working with him on a fast-paced automation project."
        },
        {
            name: "Jane Smith",
            position: "Tech Lead",
            company: "Acme Technologies",
            content: "Working with Ayush was a great experience. His attention to detail and problem-solving skills made our project successful. He consistently delivered high-quality code and was always willing to help team members."
        }
    ];
    
    // Function to display testimonials
    function displayTestimonials() {
        // Clear existing testimonials
        testimonialContainer.innerHTML = '';
        
        // Add each testimonial to the container
        testimonials.forEach(testimonial => {
            const initials = testimonial.name.split(' ').map(name => name[0]).join('');
            
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            testimonialCard.innerHTML = `
                <div class="testimonial-header">
                    <div class="testimonial-avatar">
                        <span>${initials}</span>
                    </div>
                    <div class="testimonial-author">
                        <h3>${testimonial.name}</h3>
                        <p>${testimonial.position}</p>
                        <p class="company">${testimonial.company}</p>
                    </div>
                </div>
                <div class="testimonial-content">
                    <p>"${testimonial.content}"</p>
                </div>
            `;
            
            testimonialContainer.appendChild(testimonialCard);
        });
    }
    
    // Display testimonials on page load
    displayTestimonials();
    
    // Show welcome modal automatically when page loads
    // Use setTimeout to ensure the modal appears after a short delay for better UX
    setTimeout(function() {
        if (welcomeModal) {
            welcomeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        }
    }, 1000); // 1 second delay
    
    // Handle modals with anchor links
    // Check if any modal is targeted on page load or hash change
    function handleModalDisplay() {
        // Get the current hash from the URL
        const hash = window.location.hash;
        
        // If hash points to a modal
        if (hash && hash.includes('modal')) {
            console.log('Modal targeted:', hash);
            
            // Hide welcome modal if testimonial modal is targeted
            if (hash === '#testimonial-modal') {
                const welcomeModalEl = document.getElementById('welcome-modal');
                if (welcomeModalEl) {
                    welcomeModalEl.style.display = 'none';
                }
                
                // Set body overflow to hidden when modal is open
                document.body.style.overflow = 'hidden';
                document.body.classList.add('modal-open');
            }
        }
    }
    
    // Run on page load
    handleModalDisplay();
    
    // Run when hash changes
    window.addEventListener('hashchange', handleModalDisplay);
    
    // Handle share experience links
    const shareLinks = document.querySelectorAll('a[href="#testimonial-modal"]');
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close welcome modal when clicking share experience
            const welcomeModalEl = document.getElementById('welcome-modal');
            if (welcomeModalEl) {
                welcomeModalEl.style.display = 'none';
            }
            
            // Set body overflow to hidden
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        });
    });
    
    // Close welcome modal when X is clicked
    if (closeWelcomeModal) {
        closeWelcomeModal.addEventListener('click', function() {
            welcomeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close welcome modal when "Maybe Later" button is clicked
    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener('click', function() {
            welcomeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            testimonialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when clicking on the backdrop
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function() {
            testimonialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === testimonialModal) {
            testimonialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && testimonialModal.style.display === 'block') {
            testimonialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
        }
    });
    
    // Handle form submission
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const position = document.getElementById('position').value;
            const company = document.getElementById('company').value;
            const testimonialText = document.getElementById('testimonial').value;
            const email = document.getElementById('email').value;
            
            // Show sending status
            formStatus.textContent = 'Sending your testimonial...';
            formStatus.style.color = '#6C63FF';
            
            // Send email using Email.js service
            const templateParams = {
                from_name: name,
                from_email: email,
                position: position,
                company: company,
                testimonial: testimonialText
            };
            
            // EmailJS configuration - use your service ID and template ID
            emailjs.send('service_fe4qvxr', 'template_nipmwqm', templateParams, 'l_pp6ArA4M8facPzS')
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.textContent = 'Testimonial submitted successfully! Thank you for your feedback.';
                    formStatus.style.color = 'green';
                    
                    // Add the new testimonial to the display (in a real app, you'd add it to your database)
                    testimonials.unshift({
                        name: name,
                        position: position,
                        company: company,
                        content: testimonialText
                    });
                    
                    // Update the display
                    displayTestimonials();
                    
                    // Reset the form
                    testimonialForm.reset();
                    
                    // Close the modal after a delay
                    setTimeout(function() {
                        testimonialModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        document.body.classList.remove('modal-open');
                    }, 3000);
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    formStatus.textContent = 'Failed to submit testimonial. Please try again.';
                    formStatus.style.color = 'red';
                });
        });
    }
});
