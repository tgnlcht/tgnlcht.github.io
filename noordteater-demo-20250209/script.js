document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  loadLandingAnimation();
  loadHighlightSlideshow();
  addNavbarAnimation();
  loadHorizontalAnimateHighlightWrapper();
  loadProductionCountdown(1740423600);
  batchSectionAnimations();
  loadGallery();
});

function loadGallery() {
  $("#mygallery").justifiedGallery({
    waitThumbnailsLoad: true,
    rowHeight: 300,
    lastRow: 'nojustify',
    margins: 1,
    captions: false,
    randomize: false,
  });

  lightbox.option({
    showImageNumberLabel: false,
    wrapAround: true,
  });
}


function loadHorizontalAnimateHighlightWrapper() {
  let mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    let hightlightWrapper = document.querySelector('#highlight-wrapper');
    let divs = hightlightWrapper.querySelectorAll(".highlight-panel");
    let parentTween = gsap.to(divs, {
      xPercent: -100 * (divs.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: hightlightWrapper,
        pin: true,
        scrub: 2,
        end: "+=3500",
      },
      //force3D: true, // Enable GPU acceleration
    });
    ScrollTrigger.normalizeScroll(true);
  });

}

function loadLandingAnimation() {
  gsap.set(".overlay", { opacity: 1 });
  gsap.set(".cutout-text", { y: 50, opacity: 0 });

  const introTimeline = gsap.timeline();

  introTimeline
    .to(".overlay", {
      opacity: 0.7, // Keep slight overlay for readability
      duration: 1.5,
      ease: "power3.out",
    })
    .to(".cutout-text", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
    }, "-=1") // Start fading in text while overlay is fading out
    .to(".cutout-text", {
      y: -5,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut",
    }); // Gentle floating effect

  gsap.to(".bouncing-arrow", {
    opacity: 1,
    y: -10,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: "sine.inOut",
  });
}


function preloadImages(slides, callback) {
  let loaded = 0;
  slides.forEach(slide => {
    const img = new Image();
    img.src = slide.style.backgroundImage.slice(5, -2);
    img.onload = () => {
      loaded++;
      if (loaded === slides.length) callback(); // Start animation after all images load
    };
  });
}

function loadHighlightSlideshow() {
  let mm = gsap.matchMedia();
  var slides;
  mm.add("(min-width: 1024px)", () => {
    slides = document.querySelectorAll(".slide.is-hidden-touch");
  });
  mm.add("(max-width: 1023px)", () => {
    slides = document.querySelectorAll(".slide.is-hidden-desktop");
  });

  console.log(slides);
  const numberOfSlides = slides.length;
  const baseDuration = 1.5;
  const fadeOutDelay = 0.5;

  gsap.set(slides, { opacity: 0 }); // Start all slides as hidden
  gsap.set(slides[0], { opacity: 1 }); // Make the first slide visible


  preloadImages(slides, () => {

    const slideshowTimeline = gsap.timeline({ repeat: -1, defaults: { duration: baseDuration, ease: "power2.inOut" } });

    for (let i = 0; i < numberOfSlides; i++) {
      const nextSlide = slides[(i + 1) % numberOfSlides];

      slideshowTimeline
        .to(nextSlide, { opacity: 1, scale: 1.05 }, "<0.5") // Start fading in before the previous slide fades out
        .to(slides[i], { opacity: 0, scale: 1 }, `+=${fadeOutDelay}`); // Delayed fade-out to avoid white flash
    }
  });
}


function addNavbarAnimation() {
  gsap.set(".navbar", { opacity: 0, y: -50 });
  const navbar = document.querySelector('.navbar');
  gsap.to(
    ".navbar",
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "Power2.out",
      scrollTrigger: {
        trigger: "#highlight-wrapper",
        start: "top 50%",
        toggleActions: "play none none reverse",
      },
    }
  );
}

function loadProductionCountdown(targetTimestamp) {
  const now = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

  const countdownBox = document.querySelector('.countdown-box');


  if (now > targetTimestamp) {
    countdownBox.style.display = 'none'; // hide the box
  } else {
    var flipdown = new FlipDown(targetTimestamp, {
      theme: "dark",
      headings: ["Dagen", "Uren", "Minuten", "Seconden"]
    })
      .start();
  }
}

function batchSectionAnimations() {

  // Split text into spans for animation
  document.querySelectorAll(".animated-panel .section-title").forEach(title => {
    const letters = title.textContent.split("");
    title.innerHTML = letters.map(letter => `<span>${letter}</span>`).join("");
  });

  gsap.set(".animated-panel .section-title span", { opacity: 0, y: 20 });

  // Batch animations for sections
  ScrollTrigger.batch(".animated-panel", {
    interval: 0.1, // Time between each batch execution
    start: "top 80%",
    end: "bottom 20%",
    once: true,
    onEnter: batch => {
      batch.forEach(section => {
        const titleSpans = Array.from(section.querySelectorAll(".section-title span"));
        const content = section.querySelector(".section-content");

        // Animate title letter-by-letter
        gsap.to(titleSpans,
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }
        );

        // Optionally animate content
        if (content) {
          gsap.fromTo(content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 2, ease: "bounce.out" }
          );
        }
      });
    }
  });
}