/**
 * FAQ Accordion Component
 * Handles toggle functionality for FAQ section
 */

class FAQAccordion {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFAQs();
        });
    }

    setupFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            
            if (question && answer && icon) {
                question.addEventListener('click', () => {
                    this.toggleFAQ(item, answer, icon);
                });
            }
        });
    }

    toggleFAQ(currentItem, answer, icon) {
        const isCurrentlyOpen = currentItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== currentItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                const otherIcon = item.querySelector('.faq-icon');
                
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.padding = '0 1.5rem';
                    otherAnswer.style.overflow = 'hidden';
                }
                if (otherIcon) {
                    otherIcon.textContent = '+';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Toggle current FAQ
        if (isCurrentlyOpen) {
            // Close current FAQ
            currentItem.classList.remove('active');
            answer.style.maxHeight = '0';
            answer.style.padding = '0 1.5rem';
            answer.style.overflow = 'hidden';
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Open current FAQ - calculate proper height
            currentItem.classList.add('active');
            
            // Reset styles to measure content
            answer.style.maxHeight = 'none';
            answer.style.padding = '1rem 1.5rem';
            answer.style.overflow = 'visible';
            
            // Get the actual content height
            const contentHeight = answer.scrollHeight;
            
            // Set maxHeight to allow full content + some buffer
            answer.style.maxHeight = (contentHeight + 50) + 'px';
            answer.style.overflow = 'auto'; // Allow scrolling if needed
            
            icon.textContent = '×';
            icon.style.transform = 'rotate(180deg)';
            
            console.log(`📏 FAQ expanded with height: ${contentHeight}px`);
        }
    }
}

// Initialize FAQ system
window.faqAccordion = new FAQAccordion();
