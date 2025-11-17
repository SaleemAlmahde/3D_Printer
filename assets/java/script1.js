let importantCats = ["all"];
let otherCats = [];
let filteredProducts = [];
let loadedCount = 0;
const itemsPerLoad = 15; // عدد المنتجات التي تُعرض كل مرة
let searchQuery = "";
const scrollTopBtn = document.getElementById("scrollTopBtn"); // زر العودة للأعلى
// ==========================
// 🛒 مصفوفة السلة العامة
// ==========================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


function showCat() {
    finalBaseProducts.forEach(product => {
        const firstCat = product.categories[0];
        if (!importantCats.includes(firstCat)) {
            importantCats.push(firstCat);
        }
        for (let i = 1; i < product.categories.length; i++) {
            const otherCategory = product.categories[i];
            if (!otherCats.includes(otherCategory) && !importantCats.includes(otherCategory)) {
                otherCats.push(otherCategory);
            }
        }
    });

    const importantCatDiv = document.getElementById("importantCats");
    let importantHTML = "";

    importantCats.forEach(cat => {
        importantHTML += `
            <button onclick="filterProducts('${cat}')" id="${cat}">${cat}</button>
        `;
    });

    importantCatDiv.innerHTML = importantHTML;

    const dropDown = document.getElementById("otherCat");
    let otherHTML = `<option value="Other" selected>Other</option>`;

    otherCats.forEach(cat => {
        otherHTML += `
            <option value="${cat}">${cat}</option>
        `;
    });

    dropDown.innerHTML = otherHTML;

    let btn = document.getElementById("all");
    btn.classList.add("active-cat");
}

function filterProducts(category, fromSelect = false) {
    // إعادة العد عند تغيير التصنيف
    loadedCount = 0;

    if (category === "all" || category === "Other") {
        filteredProducts = finalBaseProducts;
    } else {
        filteredProducts = finalBaseProducts.filter(product =>
            product.categories.includes(category)
        );
    }

    importantCats.forEach(cat => {
    let btn = document.getElementById(cat);
    if (btn) {
        if (category === "Other") {
            // اجعل زر "all" نشط عند اختيار "Other"
            if (cat === "all") btn.classList.add("active-cat");
            else btn.classList.remove("active-cat");
        } else {
            // المنطق العادي
            if (cat == category) btn.classList.add("active-cat");
            else btn.classList.remove("active-cat");
        }
    }
});


    // فقط عندما لا يكون من القائمة المنسدلة نعيدها لقيمة "Other"
    if (!fromSelect) {
        const sel = document.getElementById("otherCat");
        if (sel) sel.value = "Other";
    }

    // حالة select (active)
    const dropDown = document.getElementById("otherCat");
    if (dropDown) {
      if (category === "Other" || importantCats.includes(category)) {
          dropDown.classList.remove("active-cat");
      } else {
          dropDown.classList.add("active-cat");
      }
    }

    // إعادة عرض المنتجات من البداية
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";

    // إعادة اظهار الزر وتمكينه في حال وجود منتجات كافية
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const productsInfo = document.getElementById("productsInfo");
    if (!loadMoreBtn || !productsInfo) {
      // لو عناصر ال DOM غير موجودة، نخرج مبكراً
      loadMoreProducts();
      return;
    }

    if (filteredProducts.length === 0) {
      // لا منتجات
      loadMoreBtn.style.display = "none";
      productsInfo.textContent = "لا توجد منتجات";
      return;
    }

    // أظهر الزر إذا كان هناك منتجات تُعرض لاحقاً
    loadMoreBtn.style.display = "inline-block";
    loadMoreBtn.disabled = false;
    productsInfo.textContent = `تم عرض 0 من أصل ${filteredProducts.length} منتج`;

    // حمل أول دفعة
    loadMoreProducts();
}


function loadMoreProducts() {
    const productsDiv = document.getElementById("products");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const productsInfo = document.getElementById("productsInfo");

    // تأكد أن المتغيرات موجودة
    if (!productsDiv || !loadMoreBtn || !productsInfo) return;

    // جلب المنتجات التالية
    const nextProducts = filteredProducts.slice(loadedCount, loadedCount + itemsPerLoad);

    // لو لا توجد منتجات على الإطلاق
    if (nextProducts.length === 0) {
        // إذا لم يكن هناك شيء للعرض (مثلاً عدد المنتجات أقل من 1)
        if (loadedCount === 0) {
            productsInfo.textContent = "لا توجد منتجات";
        }
        loadMoreBtn.style.display = "none";
        return;
    }

    // أثناء التحميل: إظهار مؤشر بسيط داخل الزر (اختياري)
    const originalBtnHTML = loadMoreBtn.innerHTML;
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = 'جارٍ التحميل...';

    nextProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.setAttribute("onclick", "addActiveCard(this)");

        card.innerHTML = `
            <div class="slider-container" onmouseover="stopAutoSlide(this)" onmouseout="startAutoSlide(this)">
            <div class="slider">
            ${product.images.map((imgSrc , index)=>`<div class="slide"><img src="${imgSrc}" alt="Image ${index+1}"></div>`).join('')}
            </div>
            <button class="prev" onclick="prev"event.stopPropagation(); prevSlide(this)">&#10095;</button>
            <button class="next" onclick="event.stopPropagation(); nextSlide(this)">&#10094;</button>
            </div>
            <div class="dots-container">
            ${product.images.map((imgSrc , index)=>`<span class="dot" data-index="${index}" onclick="stopAutoSlide(this.parentElement.parentElement); showSlides(this.parentElement.parentElement,${index}); startAutoSlide(this.parentElement.parentElement)"></span>`).join('')}
            </div>
            <div class="product-card-bottom">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.shortDisc || ''}</p>
                </div>
                <button class="product-button" onclick="showModal('${product.id}')">
                    <i class="fa fa-cart-plus"></i>
                </button>
            </div>
        `;
        productsDiv.appendChild(card);

            // تهيئة السلايدر لهذا المنتج
    initializeSlider(card);

        // تأثير الظهور المتتالي
        setTimeout(() => card.classList.add("show"), 100 * index);
    });

    // تمرير تلقائي لأول منتج جديد
    setTimeout(() => {
        const firstNew = document.querySelectorAll(".product-card")[loadedCount];
        if (firstNew) firstNew.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 600);

    loadedCount += nextProducts.length;

    // تحديث النص السفلي
    productsInfo.textContent = `تم عرض ${loadedCount} من أصل ${filteredProducts.length} منتج`;

    // إعادة الزر إلى حالته العادية
    loadMoreBtn.innerHTML = originalBtnHTML;
    loadMoreBtn.disabled = false;

    // إخفاء الزر عند الانتهاء
    if (loadedCount >= filteredProducts.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.display = "none";
        productsInfo.textContent = "✅ تم عرض جميع المنتجات";
    }
}

function addActiveCard(card) {
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active-card'));
    card.classList.toggle('active-card');
}

function showModal(id) {
    const product = finalBaseProducts.find(r => r.id == id);
    const modelContent = document.getElementById("modalContent");

        // عرض الألوان كدوائر
        let colorsHTML = '';
        if (product.colors && product.colors.length > 0) {
            colorsHTML = `<div class="color-container" id="colorContainer" style="display:flex; gap:10px; margin:12px 0; align-items:center;">
                ${product.colors.filter(c => c.code).map(c => `
                    <div class="color-circle" title="${c.name}" onclick="selectColor(this, '${id}', '${c.name}', '${c.code}')" style="width:28px; height:28px; border-radius:50%; background:${c.code}; cursor:pointer; box-shadow:0 2px 6px #0001;"></div>
                `).join('')}
            </div>`;
        }

        modelContent.innerHTML = `
                <div class="container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                        <h2>${product.name}</h2>
                        <h3>${product.price}</h3>
                        </div>
                        <img src="./${product.image}" alt="${product.name}">
                        </div>
                        ${colorsHTML}
                        <input type="number" id="pQ" placeholder="الكمية" required>
                        <button onClick="addToCart('${id}')">أضف للسلة</button>
                </div>
        `;

    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
    document.body.style.overflow = "";
}

function selectColor(clickedElement, productId, colorName, colorCode) {
    // 1. البحث عن المنتج (للتأكد فقط)
    const product = finalBaseProducts.find(p => p.id == productId);
    if (!product) return;

    const colorContainer = document.getElementById("colorContainer");

    // 2. تخزين اللون المختار في dataset
    colorContainer.dataset.selectedColor = JSON.stringify({
        name: colorName,
        code: colorCode
    });

    // 3. إلغاء التمييز عن جميع دوائر الألوان
    // البحث عن جميع العناصر وإزالة الفئة النشطة منها
    const colorOptions = document.querySelectorAll(".color-circle");
    colorOptions.forEach(opt => {
        opt.classList.remove("active-color");
    });
    
    // 4. تمييز العنصر المضغوط عليه مباشرةً
    clickedElement.classList.add("active-color"); 

    // 5. تعبئة الكمية والتركيز
    const qInput = document.getElementById("pQ");
    qInput.value = "1";
    qInput.focus();
}

function addToCart(productId) {
  const product = finalBaseProducts.find(p => p.id == productId);
  const qInput = document.getElementById("pQ");
  const colorContainer = document.getElementById("colorContainer");

  if (!product) {
    alert("⚠️ المنتج غير موجود");
    return;
  }

  const selectedColorData = colorContainer.dataset.selectedColor;
  if (!selectedColorData) {
    alert("⚠️ يرجى اختيار لون للمنتج");
    return;
  }

  const quantity = parseInt(qInput.value) || 1;
  const selectedColor = JSON.parse(selectedColorData);

  // هل المنتج بنفس اللون موجود مسبقًا؟
  const existingItem = cartItems.find(
    item => item.productId === product.id && item.selectedColor.code === selectedColor.code
  );

  if (existingItem) {
    existingItem.quantity += quantity; // زيادة الكمية
  } else {
    cartItems.push({
      id: Date.now(),
      productId: product.id,
      quantity: quantity,
      selectedColor: selectedColor
    });
  }

  // حفظ في localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // تنظيف الحقول
  delete colorContainer.dataset.selectedColor;
  qInput.value = "";

  const colorSelector = document.querySelector(".color-selector");
  if (colorSelector) colorSelector.remove();

  // رسالة نجاح لطيفة
  alert(`✅ تمت إضافة ${product.name} (${selectedColor.name}) إلى السلة!`);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
        scrollBtn.classList.remove("hide");
    } else {
        scrollBtn.classList.remove("show");
        scrollBtn.classList.add("hide");
        setTimeout(() => scrollBtn.classList.remove("hide"), 300);
    }
});


function searchProducts() {
    const input = document.getElementById("searchInput");
    searchQuery = input.value.trim().toLowerCase();

    // إعادة ضبط المنتجات المحملة
    loadedCount = 0;
    document.getElementById("products").innerHTML = "";

    // تحديث filteredProducts بناء على البحث + التصنيف
    let category = document.getElementById("otherCat").value;
    if (category === "Other") category = "all";

    let baseList = category === "all" ? finalBaseProducts : finalBaseProducts.filter(p => p.categories.includes(category));

    if (searchQuery !== "") {
    filteredProducts = baseList.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        (p.shortDisc && p.shortDisc.toLowerCase().includes(searchQuery)) ||
        p.categories.some(cat => cat.toLowerCase().includes(searchQuery))
    );
} else {
    filteredProducts = baseList;
}

    // إعادة تفعيل زر عرض المزيد
    const loadBtn = document.getElementById("loadMoreBtn");
    loadBtn.style.display = filteredProducts.length > 0 ? "block" : "none";
    loadBtn.disabled = false;

    // إعادة ضبط النص
    document.getElementById("productsInfo").textContent = "";

    // تحميل أول دفعة من النتائج
    loadMoreProducts();
}


// بدء التشغيل
window.onload = function () {
    filteredProducts = finalBaseProducts;
    showCat();
    loadMoreProducts();
};






































// دالة لتهيئة كل سلايدر
function initializeSlider(card) {
    const slider = card.querySelector('.slider');
    const slides = card.querySelectorAll('.slide');
    const dots = card.querySelectorAll('.dot');
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // حفظ البيانات في عنصر السلايدر
    slider.currentIndex = 0;
    slider.autoSlideInterval = null;
    
    // تحديث النقاط
    updateDots(card);
}

// تعديل جميع الدوال لتأخذ عنصر السلايدر كمعامل
function showSlides(sliderContainer, index) {
    const slider = sliderContainer.querySelector('.slider');
    const slides = sliderContainer.querySelectorAll('.slide');
    const dots = sliderContainer.querySelectorAll('.dot');
    
    let currentIndex = slider.currentIndex || 0;
    
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }
    
    slider.currentIndex = currentIndex;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots(sliderContainer);
}

function nextSlide(button) {
    const sliderContainer = button.parentElement;
    const slider = sliderContainer.querySelector('.slider');
    showSlides(sliderContainer, (slider.currentIndex || 0) + 1);
}

function prevSlide(button) {
    const sliderContainer = button.parentElement;
    const slider = sliderContainer.querySelector('.slider');
    showSlides(sliderContainer, (slider.currentIndex || 0) - 1);
}

function updateDots(sliderContainer) {
    const dots = sliderContainer.querySelectorAll('.dot');
    const slider = sliderContainer.querySelector('.slider');
    const currentIndex = slider.currentIndex || 0;
    
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoSlide(sliderContainer) {
    const slider = sliderContainer.querySelector('.slider');
    if (slider.autoSlideInterval) {
        clearInterval(slider.autoSlideInterval);
    }
    slider.autoSlideInterval = setInterval(() => {
    nextSlide(sliderContainer.querySelector('.next'));
}, 4000);
}

function stopAutoSlide(sliderContainer) {
    const slider = sliderContainer.querySelector('.slider');
    if (slider.autoSlideInterval) {
        clearInterval(slider.autoSlideInterval);
        slider.autoSlideInterval = null;
    }
}