const hideForOneSecond = function() {
  const target = event.target;
  target.style.visibility = 'hidden';
  setTimeout(() => {
    target.style.visibility = 'visible';
  }, 1000);
};

const setEventListner = function() {
  const image = document.getElementById('animated_image');
  image.onclick = hideForOneSecond;
};

window.onload = setEventListner;
