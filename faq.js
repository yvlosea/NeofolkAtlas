// FAQ Accordion and Category Filtering

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // Category Filtering
  const categoryButtons = document.querySelectorAll('.faq-category');
  const faqGroups = document.querySelectorAll('.faq-group');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const category = button.dataset.category;
      
      // Show/hide groups
      faqGroups.forEach(group => {
        if (category === 'all' || group.dataset.category === category) {
          group.style.display = 'block';
          group.classList.add('reveal', 'visible');
        } else {
          group.style.display = 'none';
        }
      });
    });
  });
  
  // Open first item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }
});
