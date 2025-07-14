async function fetchNews() {
  const url =
    'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';

  try {
    const response = await fetch(url);
    const data = await response.json();
    const articlesDiv = document.getElementById('articles');

    articlesDiv.innerHTML = ''; // Clear loading text

    // Save all articles in localStorage
    const articleData = [];

    data.items.slice(0, 5).forEach((article, index) => {
      const originalText = article.description.slice(0, 150);

      articleData.push({
        title: article.title,
        link: article.link,
        text: article.description, // full
      });

      const el = document.createElement('article');
      el.dataset.original = originalText;
      el.simplifications = {};

      el.innerHTML = `
        <h3><a href="article.html?id=${index}" target="_blank">${article.title}</a></h3>
        <p>${originalText}...</p>
        <div class="levels">
          <button class="level-btn" data-level="A2">A2</button>
          <button class="level-btn" data-level="B1">B1</button>
          <button class="level-btn" data-level="B2">B2</button>
          <button class="level-btn" data-level="C1">C1</button>
        </div>
      `;

      articlesDiv.appendChild(el);
    });

    localStorage.setItem('articles', JSON.stringify(articleData));

  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('articles').innerText = 'Failed to load news.';
  }
}

fetchNews();

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('level-btn')) {
    const level = e.target.dataset.level;
    const articleEl = e.target.closest('article');
    const articleTextEl = articleEl.querySelector('p');

    if (!articleEl.simplifications) {
      articleEl.simplifications = {};
    }

    if (articleEl.simplifications[level]) {
      articleTextEl.innerText = articleEl.simplifications[level];
      return;
    }

    articleTextEl.innerText = 'Simplifying...';

    const originalText = articleEl.dataset.original;

    try {
      const response = await fetch(
        'https://99644689-1a7a-4b0b-bc77-70309a8a8716-00-1t00k35ek17v7.picard.replit.dev/simplify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: originalText, level }),
        }
      );

      const data = await response.json();

      if (data.simplified) {
        articleEl.simplifications[level] = data.simplified;
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

