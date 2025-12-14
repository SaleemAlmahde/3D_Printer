const ADMIN_TOKEN_KEY = "adminToken";

/**
 * التحقق مما إذا كان رمز المدير مفعلاً في localStorage.
 * @returns {boolean} True إذا كان المدير مفعلاً.
 */
function isAdmin() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) === "active";
}

/**
 * تفعيل وضع المدير (Admin Mode).
 */
function enableAdminMode() {
  localStorage.setItem(ADMIN_TOKEN_KEY, "active");
  console.log("✅ تم تفعيل وضع المدير بنجاح!");
  // يجب إعادة تحميل الصفحة أو تحديث الواجهة بعد هذه الخطوة
}

/**
 * إلغاء تفعيل وضع المدير (Admin Mode).
 */
function disableAdminMode() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  console.log("❌ تم إلغاء تفعيل وضع المدير.");
  // يجب إعادة تحميل الصفحة أو تحديث الواجهة بعد هذه الخطوة
}

// enableAdminMode(); ل تفعيل وضع الادمن تكتب بالكونسول وبعدها اف5
// disableAdminMode(); ل الغاء تفعيل وضع الادمن

// متغير لتخزين ID المؤقت
let pressTimer = null;
// المدة المطلوبة للضغط المطول (مللي ثانية)
const LONG_PRESS_DURATION = 5000; // 2 ثانية

// متغير ومحدد مدة لخاصية الضغط المطول بإصبعين على الجوال
let twoFingerTimer = null;
const TWO_FINGER_LONG_PRESS_DURATION = 2000; // 2 ثواني

function startPress(event) {
  // فقط نمنع السلوك الافتراضي عند لمس لتجنّب تعطيل التمرير العام غير الضروري
  if (event.type === "touchstart") {
    event.preventDefault();
  }

  // إذا بدأ اللمس وكان هناك إصبعان، نبدأ مؤقت الضغط بإصبعين
  if (
    event.type === "touchstart" &&
    event.touches &&
    event.touches.length === 2
  ) {
    if (twoFingerTimer) return;
    twoFingerTimer = setTimeout(() => {
      if (isAdmin()) {
        disableAdminMode();
      } else {
        enableAdminMode();
      }
      window.location.reload();
    }, TWO_FINGER_LONG_PRESS_DURATION);
    return;
  }

  // إذا كان المؤقت العادي قيد التشغيل بالفعل، نتجاهل (حماية)
  if (pressTimer) return;

  // بدء مؤقت الهولد العادي (يبقى كما هو للماوس/الكمبيوتر أو الهولد بإصبع واحد)
  pressTimer = setTimeout(() => {
    if (isAdmin()) {
      disableAdminMode();
    } else {
      enableAdminMode();
    }
    window.location.reload();
  }, LONG_PRESS_DURATION);
}

function cancelPress() {
  // إيقاف أي مؤقتات قيد التشغيل (سواء تحرير الضغط، سحب، أو انتهاء اللمس)
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
  if (twoFingerTimer) {
    clearTimeout(twoFingerTimer);
    twoFingerTimer = null;
  }
}

// -----------------------------------------------------
// 💡 الخطوة 3: ربط الأحداث باللوغو عند تحميل الصفحة
// -----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // ⚠️ استبدل 'logoId' بـ ID الحقيقي لعنصر اللوغو الخاص بك
  const logoElement = document.getElementById("logo");

  if (logoElement) {
    // 1. عند بدء اللمس
    logoElement.addEventListener("touchstart", startPress);
    // 2. عند إنهاء اللمس (تحرير الإصبع)
    logoElement.addEventListener("touchend", cancelPress);
    // 3. عند تحريك الإصبع (السحب)
    logoElement.addEventListener("touchmove", cancelPress);

    // دعم الحاسوب (الزر الأيسر للماوس)
    logoElement.addEventListener("mousedown", startPress);
    logoElement.addEventListener("mouseup", cancelPress);
    logoElement.addEventListener("mouseleave", cancelPress);
  }

  // ... (بقية منطق DOMContentLoaded في utility.js إن وجد)
});
