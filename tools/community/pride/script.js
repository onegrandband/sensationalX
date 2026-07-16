// Self-contained module to keep the global scope clean
(function() {
  'use strict';

  // Curated list of impactful quotes
  const quotes = [
    {
      text: "Equality means more than passing laws. The struggle is really won in the hearts and minds of the community, where it really counts.",
      author: "Shepard Smith"
    },
    {
      text: "We must be visible. We should not be ashamed of who we are.",
      author: "Sylvia Rivera"
    },
    {
      text: "It is not our differences that divide us. It is our inability to recognize, accept, and celebrate those differences.",
      author: "Audre Lorde"
    },
    {
      text: "The only queer people are those who don't love anybody.",
      author: "Rita Mae Brown"
    },
    {
      text: "Hope will never be silent.",
      author: "Harvey Milk"
    }
  ];

  // DOM Elements
  const quoteDisplay = document.getElementById('quote-display');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteBtn = document.getElementById('next-quote-btn');

  let currentIdx = 0;

  // Function to change the quote with a subtle transition
  function changeQuote() {
    // Avoid displaying the exact same quote twice in a row
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * quotes.length);
    } while (newIdx === currentIdx);

    currentIdx = newIdx;
    const selected = quotes[currentIdx];

    // Simple fade-out and fade-in simulation
    quoteDisplay.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    setTimeout(() => {
      quoteDisplay.textContent = `"${selected.text}"`;
      quoteAuthor.textContent = `— ${selected.author}`;
      quoteDisplay.style.opacity = 1;
      quoteAuthor.style.opacity = 1;
    }, 150);
  }

  // Set up event listener and init transitions
  if (quoteBtn && quoteDisplay && quoteAuthor) {
    quoteDisplay.style.transition = 'opacity 0.15s ease-in-out';
    quoteAuthor.style.transition = 'opacity 0.15s ease-in-out';
    quoteBtn.addEventListener('click', changeQuote);
  }
})();
