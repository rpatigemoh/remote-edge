(function () {
  'use strict';

  document.querySelectorAll('[data-nav-toggle]').forEach(function (toggle) {
    var nav = toggle.closest('.nav');
    if (!nav) return;
    var menu = nav.querySelector('[data-nav-menu]');

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    if (menu) {
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target)) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

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
