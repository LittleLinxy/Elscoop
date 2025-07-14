async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';

  try {
   const response = await fetch('https://99644689-1a7a-4b0b-bc77-70309a8a8716-00-1t00k35ek17v7.picard.replit.dev/simplify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: articleText, level })
});

const data = await response.json();

    articlesDiv.innerHTML = ''; // Clear loading text

    data.items.slice(0, 5).forEach(article => {
      const el = document.createElement('article');

      el.innerHTML = `
        <h3><a href="${article.link}" target="_blank">${article.title}</a></h3>
        <p>${article.description.slice(0, 150)}...</p>
        <div class="levels">
          <button class="level-btn" data-level="A2">A2</button>
          <button class="level-btn" data-level="B1">B1</button>
          <button class="level-btn" data-level="B2">B2</button>
          <button class="level-btn" data-level="C1">C1</button>
        </div>
      `;

      articlesDiv.appendChild(el);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('articles').innerText = 'Failed to load news.';
  }
}

// Call the function on page load
fetchNews();

// Add event listener for simplification buttons
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('level-btn')) {
    const level = e.target.dataset.level;
    const articleEl = e.target.closest('article');
    const articleTextEl = articleEl.querySelector('p');
    const articleText = articleTextEl.innerText;

    articleTextEl.innerText = 'Simplifying...';

    try {
      const response = await fetch('https://99644689-1a7a-4b0b-bc77-70309a8a8716-00-1t00k35ek17v7.picard.replit.dev/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: articleText, level })
      });

      const data = await response.json();

      if (data.simplified) {
        articleTextEl.innerText = data.simplified;
      } else {
        articleTextEl.innerText = 'Error: No simplified text returned.';
      }
    } catch (err) {
      console.error(err);
      articleTextEl.innerText = 'Error simplifying text.';
    }
  }
});
