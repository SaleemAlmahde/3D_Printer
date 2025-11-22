const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');
const sliderContainer = document.querySelector('.slider-container');

let currentIndex = 0; // Tracks the current slide index
let autoSlideInterval; // Will hold the interval ID for auto-sliding

// Function to update the active dot indicator
function updateDots() {
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Function to display a specific slide based on the index
function showSlides(index) {
    if (index >= slides.length) {
        currentIndex = 0; // Reset to first slide if at the end
    } else if (index < 0) {
        currentIndex = slides.length - 1; // Go to last slide if at the beginning
    } else {
        currentIndex = index; // Otherwise, set to the provided index
    }
    slider.style.transform = `translateX(-${currentIndex * 100}%)`; // Slide transition
    updateDots(); // Update the dots to reflect the current slide
}

// Function to move to the next slide
function nextSlide() {
    showSlides(currentIndex + 1);
}

// Function to move to the previous slide
function prevSlide() {
    showSlides(currentIndex - 1);
}

// Start the automatic sliding of images
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Slide every 4 seconds
}

// Stop the automatic sliding
function stopAutoSlide() {
    clearInterval(autoSlideInterval); // Clear the interval
}

// Add click event listeners to dots for direct slide navigation
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoSlide(); // Stop auto-slide when manually selecting a slide
        showSlides(parseInt(dot.dataset.index)); // Show the selected slide
        startAutoSlide(); // Restart auto-slide
    });
});

// Add event listeners for navigation buttons
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Stop auto-slide when the mouse enters the slider container
sliderContainer.addEventListener('mouseover', stopAutoSlide);

// Restart auto-slide when the mouse leaves the slider container
sliderContainer.addEventListener('mouseout', startAutoSlide);

// Start auto-slide when the page loads
startAutoSlide();
updateDots(); // Initialize the dots



















// دوال خاصة بزر الإجراء العائم (FAB) والتصفية

/**
 * تبديل حالة قائمة الـ FAB الموسعة (Speed Dial).
 */
function toggleFabMenu() {
    const menu = document.getElementById("fabSpeedDial");
    const mainFab = document.getElementById("mainFab");
    
    // تبديل حالة العرض
    menu.classList.toggle("hidden"); 

    // تغيير أيقونة الـ FAB الرئيسي
    if (menu.classList.contains("hidden")) {
        mainFab.querySelector('i').className = 'fa fa-plus'; // عند الإغلاق
    } else {
        mainFab.querySelector('i').className = 'fa fa-times'; // عند الفتح
    }
}

/**
 * فتح مودال التصفية (Bottom Sheet).
 */
function openFilterModal() {
    const modal = document.getElementById("filterModal");
    const overlay = document.getElementById("filterOverlay");
    
    // 💡 نقطة هامة: يجب تعبئة قائمة المتاجر الخاصة بالفلتر قبل الفتح
    // سنستخدم populateStoreSelect(null) مع تعديل بسيط لاحقاً
    // حالياً نستخدم دالة افتراضية
    // populateStoreFilterSelect(); 
    
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    
    // تأكد من إغلاق قائمة الـ FAB بعد فتح المودال
    toggleFabMenu(); 
}

/**
 * إغلاق مودال التصفية.
 */
function closeFilterModal() {
    const modal = document.getElementById("filterModal");
    const overlay = document.getElementById("filterOverlay");
    
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
}

// دالة لتطبيق الفلاتر (سنقوم بكتابتها لاحقاً)
function applyFiltersAndSort() {
    // هنا سيتم قراءة قيم الفلاتر واستدعاء renderInvoices()
    closeFilterModal();
}