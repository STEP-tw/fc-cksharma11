const toggleImageOpecity = function() {
  const image = document.getElementById('animated_image');
  image.style.opacity = 0;
  setTimeout(() => {
    image.style.opacity = 1;
  }, 1000);
};

const setEventListner = function() {
  const image = document.getElementById('animated_image');
  image.onclick = toggleImageOpecity;
};

window.onload = setEventListner;
