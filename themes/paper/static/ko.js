!(function () {
  let running = false;
  function dok() {
    if (running) return;
    running = true;
    const r = document.body.appendChild(document.createElement('div'));
    r.setAttribute(
      'style',
      `position:fixed;left;0;right:0;top:0;bottom:0;z-index:5;display:flex;align-items:center;justify-content:center;`,
    );

    const cs = document.createElement('link');
    cs.rel = 'stylesheet';
    cs.href = 'https://v8.js-dos.com/latest/js-dos.css';
    document.head.appendChild(cs);

    const sc = document.createElement('script');
    sc.addEventListener('load', () => {
      Dos(r, {
        url: '/doom.jsdos',
        kiosk: true,
        autoStart: true,
      });
    });
    sc.type = 'text/javascript';
    sc.src = 'https://v8.js-dos.com/latest/js-dos.js';
    document.body.appendChild(sc);
  }

  let counter = 0;
  document.querySelector('.btn-dark').addEventListener('click', () => {
    if (++counter == 6) dok();
  });
})();
