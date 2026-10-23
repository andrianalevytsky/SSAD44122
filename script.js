document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');
  const question = document.getElementById('question');
  const story = document.getElementById('story');

  const VISIBLE_COUNT = 25;   // how many word buttons are on screen at once
  const SWAP_COUNT = 500;       // how many words get replaced each swap
  const SWAP_INTERVAL = 3000; // how often words get swapped (ms)
  const MOVE_INTERVAL = 3000; // how often visible words jump to a new spot (ms)

  // only the question wrapper is used now
  
  question.style.display = 'block';

  const words = Array.from(question.querySelectorAll('button'));
  const visible = new Set();

  // ---- helpers ----
  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomPosition(element) {
    const maxX = Math.max(0, window.innerWidth - element.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - element.offsetHeight);
    element.style.left = Math.floor(Math.random() * maxX) + 'px';
    element.style.top = Math.floor(Math.random() * maxY) + 'px';
  }

  function show(button) {
    button.style.display = ''; // let the stylesheet decide how it displays
    visible.add(button);
    randomPosition(button);    // must be shown first so it has a size
  }

  function hide(button) {
    button.style.display = 'none';
    visible.delete(button);
  }

  // ---- start: hide everything, then show 20 random words ----
  words.forEach(hide);
  const shuffled = words.slice().sort(function () { return Math.random() - 0.5; });
  shuffled.slice(0, VISIBLE_COUNT).forEach(show);

  // ---- swap a few words every second so the selection keeps changing ----
  setInterval(function () {
    for (let i = 0; i < SWAP_COUNT; i++) {
      const hiddenWords = words.filter(function (w) { return !visible.has(w); });
      if (hiddenWords.length === 0) break;
      hide(randomItem(Array.from(visible)));
      show(randomItem(hiddenWords));
    }
  }, SWAP_INTERVAL);

  // ---- move the visible words around ----
  setInterval(function () {
    visible.forEach(randomPosition);
  }, MOVE_INTERVAL);

  // ---- collect a word into the container when its button is clicked ----
  words.forEach(function (button) {
    button.addEventListener('click', function () {
      const word = button.textContent.trim();
      // space between words, but no space before punctuation
      container.textContent = (container.textContent + ' ' + word)
        .replace(/\s+([,.?!])/g, '$1')
        .trim();
    });
  });
});