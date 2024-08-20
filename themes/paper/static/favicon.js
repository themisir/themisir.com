!function () {
  const idx = Math.round(11 + 15 * new Date().getHours() / 24) % 15;
  const iconSize = 64;
  const sourceSize = 42;
  const img = document.createElement('img');
  img.addEventListener('load', function () {
    const canvas = document.createElement('canvas');
    canvas.height = iconSize;
    canvas.width = iconSize;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sourceSize * idx, 0, sourceSize, sourceSize, 0, 0, iconSize, iconSize);
    document.querySelector('link[rel="icon"]').setAttribute('href', canvas.toDataURL());
    canvas.remove();
    img.remove();
  });
  img.src = '/hourglass.png';
}();