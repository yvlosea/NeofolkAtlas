// Journal Filter functionality

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const journalEntries = document.querySelectorAll('.journal-entry');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      // Filter entries
      journalEntries.forEach(entry => {
        if (filter === 'all' || entry.dataset.category === filter) {
          entry.style.display = 'block';
          entry.classList.add('reveal', 'visible');
        } else {
          entry.style.display = 'none';
        }
      });
    });
  });
});
