(function () {
  'use strict';

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-track]');
    var slides = Array.from(track.children);
    var dotsEl = carousel.querySelector('[data-dots]');
    var prevBtn = carousel.querySelector('[data-prev]');
    var nextBtn = carousel.querySelector('[data-next]');

    if (!track || !slides.length) return;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        scrollToSlide(i);
      });
      dotsEl.appendChild(dot);
    });
    var dots = Array.from(dotsEl.children);

    function getGap() {
      return parseInt(getComputedStyle(track).gap, 10) || 0;
    }

    function getSlideStep() {
      if (!slides[0]) return 0;
      return slides[0].getBoundingClientRect().width + getGap();
    }

    function scrollToSlide(index) {
      var step = getSlideStep();
      track.scrollTo({ left: step * index, behavior: 'smooth' });
    }

    function advance(dir) {
      track.scrollBy({ left: dir * getSlideStep(), behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { advance(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { advance(1); });

    function updateState() {
      var scrollLeft = track.scrollLeft;
      var step = getSlideStep() || 1;
      var activeIndex = Math.round(scrollLeft / step);
      activeIndex = Math.max(0, Math.min(slides.length - 1, activeIndex));

      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === activeIndex);
      });

      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      if (prevBtn) prevBtn.disabled = scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll;
    }

    var rafId = null;
    track.addEventListener('scroll', function () {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateState);
    });

    window.addEventListener('resize', updateState);
    updateState();
  });
})();
