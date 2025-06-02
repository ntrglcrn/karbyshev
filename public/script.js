document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const transitionDuration = 500; // Должно совпадать с длительностью transition в CSS

  // --- Код для кастомного курсора ---
  const customCursor = document.querySelector('.custom-cursor');
  const interactiveElements = document.querySelectorAll('a, button'); // Добавьте другие селекторы, если нужны другие интерактивные элементы

  let mouseX = 0, mouseY = 0; // Целевые координаты мыши
  let cursorX = 0, cursorY = 0; // Текущие координаты курсора для анимации

  // Отслеживаем движение мыши и обновляем целевые координаты
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Функция для плавной анимации курсора
  function animateCursor() {
    if (customCursor) {
      // Интерполяция: плавно перемещаем курсор к целевым координатам
      cursorX += (mouseX - cursorX) * 0.1; // Коэффициент плавности (0.1 - примерное значение)
      cursorY += (mouseY - cursorY) * 0.1; // Коэффициент плавности

      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(animateCursor); // Запрашиваем следующий кадр анимации
  }

  // Запускаем анимацию
  animateCursor();

  // Отслеживаем наведение на интерактивные элементы
  interactiveElements.forEach(element => {
    element.addEventListener('mouseover', () => {
      body.classList.add('cursor-hover');
    });
    element.addEventListener('mouseout', () => {
      body.classList.remove('cursor-hover');
    });
  });

  // Отслеживаем нажатие и отпускание кнопки мыши
  body.addEventListener('mousedown', () => {
      body.classList.add('cursor-pressed');
  });

  body.addEventListener('mouseup', () => {
      body.classList.remove('cursor-pressed');
  });
  // --- Конец кода для кастомного курсора ---

  // --- Код для бургера и мобильного меню ---
  const burgerMenuToggle = document.querySelector('.burger-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-menu .nav a');

  if (burgerMenuToggle && mobileMenu) {
    burgerMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      burgerMenuToggle.classList.toggle('is-open');
    });

    // Close menu when a link is clicked (optional)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burgerMenuToggle.classList.remove('is-open');
      });
    });
  }
  // --- Конец кода для бургера и мобильного меню ---

  // --- Код для слайдера Featured Projects ---
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const sliderItems = document.querySelectorAll('.slider-item');

  if (sliderWrapper && prevButton && nextButton && sliderItems.length > 0) {
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;
    let slideWidth = 0;
    let slidesPerView = 3; // Default for desktop

    function updateSlidesPerView() {
      if (window.innerWidth <= 768) {
        slidesPerView = 1;
      } else if (window.innerWidth <= 1200) {
        slidesPerView = 2;
      } else {
        slidesPerView = 3;
      }
      slideWidth = sliderItems[0].offsetWidth + parseInt(getComputedStyle(sliderItems[0]).marginRight);
    }

    // Update slides per view on load and resize
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);

    // Touch events
    sliderWrapper.addEventListener('touchstart', touchStart);
    sliderWrapper.addEventListener('touchmove', touchMove);
    sliderWrapper.addEventListener('touchend', touchEnd);

    // Mouse events
    sliderWrapper.addEventListener('mousedown', touchStart);
    sliderWrapper.addEventListener('mousemove', touchMove);
    sliderWrapper.addEventListener('mouseup', touchEnd);
    sliderWrapper.addEventListener('mouseleave', touchEnd);

    // Disable context menu
    window.oncontextmenu = function(event) {
      if (event.target.closest('.slider-wrapper')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }

    function touchStart(event) {
      isDragging = true;
      startPos = getPositionX(event);
      animationID = requestAnimationFrame(animation);
      sliderWrapper.style.cursor = 'grabbing';
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      const movedBy = currentTranslate - prevTranslate;
      
      // Determine if we should move to next/prev slide
      if (Math.abs(movedBy) > 100) {
        if (movedBy < 0) {
          currentIndex = Math.min(currentIndex + 1, sliderItems.length - slidesPerView);
        } else {
          currentIndex = Math.max(currentIndex - 1, 0);
        }
      }
      
      setPositionByIndex();
      sliderWrapper.style.cursor = 'grab';
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
      currentTranslate = currentIndex * -slideWidth;
      prevTranslate = currentTranslate;
      setSliderPosition();
    }

    function goToSlide(slideIndex) {
      currentIndex = slideIndex;
      setPositionByIndex();
    }

    prevButton.addEventListener('click', () => {
      goToSlide(Math.max(currentIndex - 1, 0));
    });

    nextButton.addEventListener('click', () => {
      goToSlide(Math.min(currentIndex + 1, sliderItems.length - slidesPerView));
    });

    // Initialize slider
    setPositionByIndex();
  }
  // --- Конец кода для слайдера Featured Projects ---

  // --- Код для карусели изображений ---
  const imageCarousel = document.querySelector('.image-carousel');
  const heroRect = document.querySelector('.hero-rect'); // Get the parent section
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let autoScrollInterval;
  let lastDragPosition = 0;
  let dragVelocity = 0;
  let lastDragTime = 0;
  const scrollSpeed = 0.5;
  const scrollDelay = 16;
  const inertiaDecay = 0.95;
  const inertiaMultiplier = 50;
  let originalSetWidth = 0;
  const numberOfOriginalImages = 6;

  let scrollOffset = 0; // To store the offset from page scroll

  if (imageCarousel && heroRect) {
    const images = imageCarousel.querySelectorAll('img');
    if (images.length > 0) {
        let imagesLoaded = 0;
        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded >= images.length) { // Check against total images loaded
                        calculateOriginalSetWidth();
                        startAutoScroll();
                        updateScrollOffset(); // Calculate initial scroll offset
                    }
                });
            }
        });
        if (imagesLoaded >= images.length) {
             calculateOriginalSetWidth();
             startAutoScroll();
             updateScrollOffset(); // Calculate initial scroll offset
        }
    }

    function calculateOriginalSetWidth() {
        originalSetWidth = 0;
        const images = imageCarousel.querySelectorAll('img');
        for(let i = 0; i < numberOfOriginalImages; i++){
            if(images[i]){
                 originalSetWidth += images[i].offsetWidth + parseInt(window.getComputedStyle(images[i]).marginRight || '0');
            }
        }
        // Recalculate initial currentTranslate and prevTranslate based on new originalSetWidth
        const transform = window.getComputedStyle(imageCarousel).transform;
        const matrix = new DOMMatrix(transform);
        currentTranslate = matrix.m41;
        prevTranslate = currentTranslate;
         // Normalize initial position to be within the seamless range
         if (originalSetWidth > 0) {
             // Position it roughly in the middle set
             currentTranslate = ((currentTranslate % originalSetWidth) + originalSetWidth) % originalSetWidth - originalSetWidth;
             prevTranslate = currentTranslate;
         }
        applyFinalTranslation(); // Apply initial position

        console.log('Original set width:', originalSetWidth);
    }

    // Mouse events
    imageCarousel.addEventListener('mousedown', dragStart);
    imageCarousel.addEventListener('mousemove', drag);
    imageCarousel.addEventListener('mouseup', dragEnd);
    imageCarousel.addEventListener('mouseleave', dragEnd);

    // Touch events
    imageCarousel.addEventListener('touchstart', dragStart);
    imageCarousel.addEventListener('touchmove', drag);
    imageCarousel.addEventListener('touchend', dragEnd);

    // Scroll event listener
    window.addEventListener('scroll', updateScrollOffset);

    function startAutoScroll() {
      if (!autoScrollInterval && originalSetWidth > 0 && !isDragging) {
        autoScrollInterval = setInterval(() => {
            currentTranslate -= scrollSpeed; // Auto scroll always updates base translation
            applyFinalTranslation(); // Apply the combined translation
        }, scrollDelay);
      }
    }

    function stopAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }

    function updateScrollOffset() {
        if (originalSetWidth <= 0) return; // Ensure width is known

        const sectionRect = heroRect.getBoundingClientRect();
        const sectionHeight = heroRect.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress within the hero section (0 to 1)
        // Adjust calculation for desired effect timing and range
        const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - sectionRect.top) / (viewportHeight + sectionHeight)));

        // Calculate the maximum horizontal scroll distance based on original set width
        // We want to scroll horizontally by one originalSetWidth as the section scrolls into view
        const maxHorizontalScroll = originalSetWidth / 2; // Adjust this multiplier as needed - Reduced by half

        scrollOffset = -maxHorizontalScroll * scrollProgress;

        applyFinalTranslation(); // Apply the combined translation when scroll offset changes
    }

    function dragStart(event) {
      isDragging = true;
      imageCarousel.classList.add('dragging');
      startPos = getPositionX(event);
      lastDragPosition = startPos;
      lastDragTime = Date.now();
      stopAutoScroll();
      
      // Get the current visual position to start dragging from
      const transform = window.getComputedStyle(imageCarousel).transform;
      const matrix = new DOMMatrix(transform);
      prevTranslate = matrix.m41; // Start dragging from the current visual position
      currentTranslate = prevTranslate; // Initialize currentTranslate for dragging

      // We need to calculate the offset relative to the base auto-scroll position
      // This might be complex, let's simplify and just stop auto-scroll and rely on drag + scrollOffset

    }

    function drag(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        const currentTime = Date.now();
        const timeDiff = currentTime - lastDragTime;
        
        if (timeDiff > 0) {
          dragVelocity = (currentPosition - lastDragPosition) / timeDiff;
        }
        
        lastDragPosition = currentPosition;
        lastDragTime = currentTime;
        
        // Calculate the new translation based on drag movement relative to start position
        // Add the scrollOffset to the drag translation
        currentTranslate = prevTranslate + (currentPosition - startPos);
        applyFinalTranslation(); // Apply the combined translation during drag
      }
    }

    function applyInertia() {
      if (Math.abs(dragVelocity) > 0.01) {
        currentTranslate += dragVelocity * inertiaMultiplier;
        dragVelocity *= inertiaDecay;
        applyFinalTranslation(); // Apply the combined translation during inertia
        requestAnimationFrame(applyInertia);
      } else {
        dragVelocity = 0;
        // Ensure currentTranslate is updated correctly before starting auto-scroll
        // The value of currentTranslate at the end of inertia is the base for auto-scroll
        applyFinalTranslation(); // Apply final position before starting auto-scroll
        startAutoScroll();
      }
    }

    // This function applies the final calculated translation to the carousel element
    // It also handles the looping logic
    function applyFinalTranslation() {
         if (originalSetWidth <= 0) return; // Prevent incorrect logic before width is known

         // Combine base translation (from auto-scroll/drag/inertia) with scroll offset
         let finalTranslate = currentTranslate + scrollOffset;

         // Adjust finalTranslate to stay within a seamless range (e.g., centered around the second set)
         // If we have 3 sets, the total width is ~3 * originalSetWidth
         // We want the visual position to be in a range that shows the middle set, e.g., [-originalSetWidth * 2, 0]
         const minSeamlessTranslate = -originalSetWidth * 2;
         const maxSeamlessTranslate = 0; // Or a small positive buffer

         if (finalTranslate < minSeamlessTranslate) {
             // Adjust the base translation (currentTranslate) to loop
             currentTranslate += originalSetWidth;
             // Recalculate finalTranslate with the adjusted base
             finalTranslate = currentTranslate + scrollOffset;
         } else if (finalTranslate > maxSeamlessTranslate) {
             // Adjust the base translation (currentTranslate) to loop
             currentTranslate -= originalSetWidth;
             // Recalculate finalTranslate with the adjusted base
             finalTranslate = currentTranslate + scrollOffset;
         }
         
         imageCarousel.style.transform = `translateX(${finalTranslate}px)`;
    }

    function dragEnd() {
      isDragging = false;
      imageCarousel.classList.remove('dragging');
      // Update prevTranslate based on the current base translation (excluding scrollOffset)
      prevTranslate = currentTranslate; 
      
      // Start inertia
      requestAnimationFrame(applyInertia);
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Auto scroll and initial scroll offset calculation will start after image width is calculated
  }
  // --- Конец кода для карусели изображений ---

  // Функция для загрузки и вставки HTML
  function loadHTML(url, elementId) {
    // Добавляем версию к URL для предотвращения кэширования
    const version = new Date().getTime();
    const urlWithVersion = `${url}?v=${version}`;
    
    fetch(urlWithVersion)
      .then(response => response.text())
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
      })
      .catch(err => console.warn('Ошибка загрузки HTML:', err));
  }

  // Загружаем хедер и футер
  loadHTML('header.html', 'header-placeholder');
  loadHTML('footer.html', 'footer-placeholder');

  document.addEventListener('click', (event) => {
    const target = event.target;

    // Проверяем, является ли кликнутый элемент или его родитель ссылкой
    const link = target.closest('a');

    if (link && link.href) {
      const url = new URL(link.href);
      const currentUrl = new URL(window.location.href);

      // Проверяем, что это внутренняя ссылка на другую страницу
      // Игнорируем якоря на текущей странице и внешние ссылки
      if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
        event.preventDefault(); // Отменяем стандартный переход

        body.classList.add('fade-out'); // Запускаем анимацию затухания

        setTimeout(() => {
          window.location.href = link.href; // Переходим на новую страницу после анимации
        }, transitionDuration);
      }
    }
  });

  // Function to check if an element is in the viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to handle scrolling and trigger animations
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('is-visible');
      }
    });
  }

  // Add event listener for scrolling
  window.addEventListener('scroll', handleScrollAnimations);

  // Run on page load in case elements are already in view
  handleScrollAnimations();
});
