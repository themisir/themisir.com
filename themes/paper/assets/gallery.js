const gallery = document.getElementById('gallery');
$(gallery).justifiedGallery({
  rowHeight: 250,
  margins: 5,
  border: -5
}).on('jg.complete', function() {
  const licenseKeyAttr = 'data-lightgallery-license-key';
  const licenseKey = document.querySelector(`[${licenseKeyAttr}]`).getAttribute(licenseKeyAttr);

  lightGallery(gallery, {
    plugins: [lgZoom],
    licenseKey: licenseKey
  });
});
