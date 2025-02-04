document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  loadLandingAnimation();
  loadHighlightSlideshow();
  addNavbarAnimation();
  loadHighlightImageAnimation(loadHorizontalAnimateHighlightWrapper());
  loadProductionCountdown(1740423600);
  batchSectionAnimations();
  loadGallery();
});

function loadHighlightImageAnimation(parentTween) {
/*  gsap.set(".highlight-image img", { opacity: 0 });

  ScrollTrigger.batch(".highlight-image", {
    interval: 0.1, // Time between each batch execution
    start: "left 80%",
    once: true,
    containerAnimation: parentTween,
    onEnter: batch => {
      batch.forEach(highlight => {
        const image = highlight.querySelector("img");
        gsap.to(image,
          { opacity: 1, ease: "Power1.in" }
        );
      });
    }
  }); */
}

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


function loadHorizontalAnimateHighlightWrapper(inPanelAnimations) {
  let hightlightWrapper = document.querySelector('#highlight-wrapper');
  let divs = hightlightWrapper.querySelectorAll(".highlight-panel");
  let parentTween = gsap.to(divs, {
    xPercent: -100 * (divs.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: hightlightWrapper,
      pin: true,
      scrub: 1,
      end: "+=3500",
    },
    force3D: true, // Enable GPU acceleration
  });
  ScrollTrigger.normalizeScroll(true)
  return parentTween;
}

function loadLandingAnimation() {
  const introTimeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
  });

  const textElement = document.querySelector(".cutout-text");

  const vpadding = 15;
  const hpadding = 60;

  introTimeline
    .to(".overlay", {
      duration: 2,
      scaleX: () => {
        const textBounds = textElement.getBoundingClientRect();
        const overlayBounds = document.querySelector(".overlay").getBoundingClientRect();
        return (textBounds.width + hpadding * 2) / overlayBounds.width;
      },
      scaleY: () => {
        const textBounds = textElement.getBoundingClientRect();
        const overlayBounds = document.querySelector(".overlay").getBoundingClientRect();
        return (textBounds.height + vpadding * 2) / overlayBounds.height;
      },
      x: () => {
        const textBounds = textElement.getBoundingClientRect();
        const overlayBounds = document.querySelector(".overlay").getBoundingClientRect();
        return (
          textBounds.left -
          overlayBounds.left +
          textBounds.width / 2 -
          overlayBounds.width / 2
        ); // Center horizontally
      },
      y: () => {
        const textBounds = textElement.getBoundingClientRect();
        const overlayBounds = document.querySelector(".overlay").getBoundingClientRect();
        return (
          textBounds.top -
          overlayBounds.top +
          textBounds.height / 2 -
          overlayBounds.height / 2
        ); // Center vertically
      },
      transformOrigin: "center center",
      ease: "power3.inOut",
    }, "<")
    .to(".overlay", {
      duration: 1.5,
      borderRadius: "0%", // Rounded effect as it shrinks
      ease: "power3.inOut",
    }, "<")
    .to(".cutout-text", {
      duration: 1.5,
      scale: 1.1,
      ease: "power2.inOut",
    }, "<")
    .fromTo(".bouncing-arrow", {
      opacity: 0,
      y: 20,
      scale: 0.5,
      rotation: 90, // Arrow spins on entry
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "back.out(2)", // Bounce-like easing
    })
    .to(".bouncing-arrow", {
      y: "-=10",
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut",
    })
    .to(".bouncing-arrow", {
      scale: 1.2,
      duration: 0.4,
      yoyo: true,
      repeat: 2,
      ease: "power2.inOut",
    }, "+=3");
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
  const slides = document.querySelectorAll(".slide");
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
        .to(nextSlide, { opacity: 1, scale: 1.05 }, "<0.5") // 👈 Start fading in before the previous slide fades out
        .to(slides[i], { opacity: 0, scale: 1 }, `+=${fadeOutDelay}`); // 👈 Delayed fade-out to avoid white flash
    }
  });
}


function addNavbarAnimation() {
  const navbar = document.querySelector('.navbar');
  gsap.fromTo(
    ".navbar",
    { opacity: 0, y: -50 },
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