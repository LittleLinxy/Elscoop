async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';
  try {
    const response = await fetch(url);
    const data = await response.json();
    const articlesDiv = document.getElementById('articles');

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

  document.getElementById('articles').appendChild(el);
});
  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('articles').innerText = 'Failed to load news.';
  }
}

fetchNews();
