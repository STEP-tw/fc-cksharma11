const toggleDisplay = function() {
  const image = document.getElementById('animated_image');
  image.style.opacity = 0;
  const toggle = setTimeout(() => {
    image.style.opacity = 1;
  }, 1000);
};
