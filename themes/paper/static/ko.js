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
    cs.href = '/js-dos/js-dos.css';
    document.head.appendChild(cs);

    const sc = document.createElement('script');
    sc.addEventListener('load', () => {
      Dos(r, {
        url: '/doom.jsdos',
        pathPrefix: '/js-dos/emulators/',
        kiosk: true,
        autoStart: true,
      });
    });
    sc.type = 'text/javascript';
    sc.src = '/js-dos/js-dos.js';
    document.body.appendChild(sc);
  }

  let counter = 0;
  const sfc = {};
  sfc.ctx = () => {
    return sfc._ctx || (sfc._ctx = new (window.AudioContext || window.webkitAudioContext)());
  }
  sfc.get = async (url) => {
    let audio = sfc[url];
    if (audio) return audio;

    const response = await fetch(url);
    const buf = await response.arrayBuffer();
    sfc[url] = audio = await sfc.ctx().decodeAudioData(buf);

    return audio;
  }
  sfc.play = (buf) => {
    const src = sfc.ctx().createBufferSource();
    src.buffer = buf;
    src.connect(sfc.ctx().destination);
    src.start(0);
  }
  document.querySelector('.btn-dark').addEventListener('click', async () => {
    if (++counter == 6) {
      dok();
    } else {
      // credits: http://www.wolfensteingoodies.com/archives/olddoom/music.htm
      // preload first
      const dspstop = await sfc.get('/dspstop.wav');
      const dspstart = await sfc.get('/dspstart.wav');

      // fire
      if (counter > 1) {
        const s = isDark ? dspstop : dspstart;
        sfc.play(s);
      }
    }
  });
})();
