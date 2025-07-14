const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const articleData = JSON.parse(localStorage.getItem('articles')) || [];
const article = articleData[id];

if (!article) {
  document.getElementById('article').innerHTML = '<p>Article not found.</p>';
} else {
  const section = document.getElementById('article');
  section.innerHTML = `
    <h2>${article.title}</h2>
    <p>${article.text}</p>
    <div class="levels">
      <button class="level-btn" data-level="A2">A2</button>
      <button class="level-btn" data-level="B1">B1</button>
      <button class="level-btn" data-level="B2">B2</button>
      <button class="level-btn" data-level="C1">C1</button>
    </div>
  `;

  const articleTextEl = section.querySelector('p');
  const simplifications = {};
  const originalText = article.text;

  document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('level-btn')) {
    const level = e.target.dataset.level;

    if (simplifications[level]) {
      articleTextEl.innerText = simplifications[level];
      return;
    }

    articleTextEl.innerText = 'Simplifying...';

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
        simplifications[level] = data.simplified;
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
