// Language is selected before the game loads; all scenes use one consistent language.
(() => {
  const english = /\/en\/(?:index\.html)?$/.test(location.pathname);
  const query = new URLSearchParams(location.search);
  let preferred = query.get('lang');
  try {
    if (!['en', 'he'].includes(preferred)) preferred = localStorage.getItem('spider-house-language');
    if (['en', 'he'].includes(preferred)) localStorage.setItem('spider-house-language', preferred);
  } catch {}
  if (['en', 'he'].includes(preferred) && (preferred === 'en') !== english) {
    const target = new URL(english ? '../' : 'en/', location.href);
    target.search = location.search;
    location.replace(target.href);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('language-switch');
    if (!link) return;
    const target = new URL(english ? '../' : 'en/', location.href);
    target.search = location.search;
    target.searchParams.set('lang', english ? 'he' : 'en');
    link.href = target.href;
    link.addEventListener('click', () => {
      try { localStorage.setItem('spider-house-language', english ? 'he' : 'en'); } catch {}
    });
  });
})();
