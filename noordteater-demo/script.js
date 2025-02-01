document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  loadLandingAnimation();
  loadHighlightSlideshow();
  addNavbarAnimation();
  loadHorizontalAnimateHighlightWrapper(function (parentTween) {
    loadHighlightImageAnimation(parentTween, "#highlight-image-1");
    loadHighlightImageAnimation(parentTween, "#highlight-image-2");
    loadHighlightImageAnimation(parentTween, "#highlight-image-3");
    loadHighlightImageAnimation(parentTween, "#highlight-image-4");
    loadHighlightImageAnimation(parentTween, "#highlight-image-5");
  });
  loadProductionCountdown(1740423600);
  loadSectionAnimation("#storypanel", true);
  loadSectionAnimation("#production", true);
  loadSectionAnimation("#gallery", false);
  loadGallery();
});

function loadHighlightImageAnimation(parentTween, highlightImageId) {
  let highlightImage = document.querySelector(highlightImageId);
  let image = highlightImage.querySelector(".responsive-image");
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: highlightImage,
      containerAnimation: parentTween,
      start: "left 80%",
      toggleActions: "play none none none",
    }
  });
  tl.from(highlightImage, {
    autoAlpha: 0,
    ease: "Power1.in",
  });
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
    }
  });

  inPanelAnimations(parentTween);
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

function loadHighlightSlideshow() {
  const preloader = document.querySelector('.preloader');
  const slides = document.querySelectorAll('.slide');
  const numberOfSlides = slides.length;
  const baseDuration = 1.5;
  const fadeOutDelay = 1;

  function loadImage(slide) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = slide.style.backgroundImage.slice(5, -2); // Extract url from background image string
      img.onload = () => {
        resolve(slide);
      };
      img.onerror = (err) => {
        console.error(`Error loading image ${img.src}`);
        reject(err);
      };
    });
  }

  Promise.all(Array.from(slides).map(slide => loadImage(slide)))
    .then((loadedSlides) => {
      // Hide the preloader
      gsap.to(preloader, { duration: 0.5, opacity: 0, onComplete: () => preloader.style.display = 'none' });
      gsap.set(loadedSlides[0], { opacity: 1, scale: 1 });

      const slideshowTimeline = gsap.timeline({
        repeat: -1, // Infinite loop
        defaults: {
          duration: baseDuration,
          ease: "power2.inOut",
        },
      });

      for (let i = 0; i < numberOfSlides; i++) {
        const nextSlideIndex = (i + 1) % numberOfSlides;
        slideshowTimeline
          .to([slides[i], slides[nextSlideIndex]], { opacity: 1 }, `-=${baseDuration * 0.8}`)
          .to(slides[i], { opacity: 0 }, `+=${fadeOutDelay}`);
      }

      // ---- Scroll Trigger for slideshow  -----
      ScrollTrigger.create({
        trigger: ".description.highlight-panel.hero.is-fullheight",
        start: "top top",
        end: '+=50%',
        onEnter: () => slideshowTimeline.pause(),
        onLeaveBack: () => slideshowTimeline.play(),
      });

    })
    .catch((error) => {
      console.error('Failed to load all images:', error);
      preloader.textContent = 'Failed to Load Images, Please Refresh Page.';
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

function loadSectionAnimation(sectionId, animateContent) {
  // Split section-title into spans for letter-by-letter animation
  const section = document.querySelector(sectionId);
  const sectionTitle = section.querySelector(".section-title");
  const letters = sectionTitle.textContent.split("");
  sectionTitle.innerHTML = letters.map(letter => `<span>${letter}</span>`).join("");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionId,
      start: "top 80%", // When the section enters 80% of the viewport
      end: "bottom 20%", // Optional: End of animation trigger point
      toggleActions: "play none none none", // Play on enter, do nothing on leave
    },
  });

  // Add letter-by-letter reveal for .sectionTitle
  timeline.fromTo(
    sectionId + " .section-title span",
    {
      opacity: 0,
      y: 20, // Start slightly below
    },
    {
      opacity: 1,
      y: 0, // Animate upward into place
      duration: 0.8,
      stagger: {
        from: "random",
        amount: 1
      },
      ease: "power3.out",
    }
  );

  if (animateContent) {
    // Add .textcontent fade-in after .sectionTitle completes
    timeline.fromTo(
      sectionId + " .section-content",
      {
        opacity: 0,
        y: 40, // Start slightly below
      },
      {
        opacity: 1,
        y: 0, // Fade in and move upward
        duration: 2,
        ease: "bounce.out",
      },
      "-=1" // Overlap the animations slightly for smooth flow
    );
  }

  return timeline;
}