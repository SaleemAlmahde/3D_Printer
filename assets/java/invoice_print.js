/**
 * assets/java/invoice_print.js
 * نظام عرض وطباعة الفواتير - النسخة المحسنة
 */

(function () {
  // 1. إعداد المتغيرات الأساسية
  const params = new URLSearchParams(window.location.search);
  const invoiceId = params.get("id");

  // التحقق من وجود الفاتورة فوراً
  if (!invoiceId) {
    // استخدم توست بدلاً من alert لعدم حجب واجهة المستخدم
    try {
      if (typeof showToast === "function")
        showToast("تنبيه: فاتورة غير صالحة أو مفقودة.", 4000, "orange");
    } catch (e) {}
    return;
  }

  // 2. دالة تشغيل النظام عند تحميل الصفحة
  window.onload = function () {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find((inv) => inv.id == invoiceId);

    if (!invoice) {
      try {
        if (typeof showToast === "function")
          showToast(
            "خطأ: لم يتم العثور على بيانات الفاتورة في المتصفح.",
            4000,
            "red",
          );
      } catch (e) {}
      return;
    }

    renderInvoiceData(invoice, invoices);
    setupActionButtons(invoice);
  };

  /**
   * تطبيق تعديل واحد على قيمة
   * @param {number} total - القيمة الأساسية
   * @param {string} type - نوع التعديل: "+" أو "-" أو "+%" أو "-%"
   * @param {number} value - قيمة التعديل
   * @returns {number} القيمة بعد تطبيق التعديل
   */
  function applySingleAdjustment(total, type, value) {
    const v = parseFloat(value);
    if (!type || isNaN(v) || v === 0) return total;

    let result = total;

    switch (type) {
      case "+":
        // إضافة قيمة ثابتة
        result = total + v;
        break;
      case "-":
        // خصم قيمة ثابتة
        result = Math.max(0, total - v);
        break;
      case "+%":
        // إضافة نسبة مئوية
        result = total + (total * v) / 100;
        break;
      case "-%":
        // خصم نسبة مئوية
        result = Math.max(0, total - (total * v) / 100);
        break;
      default:
        result = total;
    }

    return Math.round(result * 100) / 100;
  }

  /**
   * دالة تطبيق الخصومات والتعديلات بشكل متسلسل
   * المجموع الأصلي → تطبيق الكوبون → تطبيق التعديل الأول → تطبيق التعديل الثاني → ... → المجموع النهائي
   */
  function calculateFinalTotal(baseTotal, coupon, adjustments) {
    let result = baseTotal;

    // 1️⃣ تطبيق الكوبون أولاً (إن وجد)
    if (coupon && coupon.discountValue !== 0) {
      const couponType = coupon.discountType === "%" ? "-%" : "-";
      result = applySingleAdjustment(result, couponType, coupon.discountValue);
    }

    // 2️⃣ تطبيق التعديلات بالترتيب (الواحد تلو الآخر)
    if (Array.isArray(adjustments) && adjustments.length > 0) {
      for (const adj of adjustments) {
        result = applySingleAdjustment(result, adj.type, adj.value);
      }
    }

    return Math.round(result * 100) / 100;
  }

  /**
   * دالة تعبئة البيانات في الصفحة
   */
  function renderInvoiceData(invoice, allInvoices) {
    const displayNumber = invoiceId.slice(0, 2);

    // تعبئة النصوص الأساسية
    document.getElementById("invoiceNumber").textContent = displayNumber;
    document.getElementById("invoiceDate").textContent = invoice.date;
    document.getElementById("exportDate").textContent =
      new Date().toLocaleDateString("ar-SY");
    document.getElementById("customerName").textContent = invoice.customerName;
    document.getElementById("customerPhone").textContent = invoice.phone;
    document.getElementById("customerCity").textContent = invoice.city;
    document.getElementById("invoiceNote").textContent = invoice.notes || "";
    document.getElementById("finalTotal").textContent =
      invoice.totalSYP.toLocaleString() + " ل.س";

    // تعبئة جدول المنتجات
    const tbody = document.getElementById("productsBody");
    tbody.innerHTML = invoice.products
      .map(
        (p, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${p.name}</td>
                <td>${p.isCustom ? p.customDescription : p.note || "-"}</td>
                <td>${p.color.name}</td>
                <td>${p.quantity}</td>
                <td>${p.priceSYP.toLocaleString()}</td>
                <td>${(p.quantity * p.priceSYP).toLocaleString()}</td>
            </tr>
        `,
      )
      .join("");

    // معالجة الخصومات والتعديلات المتعددة - تنسيق عمودي
    const calculationSection = document.getElementById("calculationSection");
    const adjustmentsListContainer = document.getElementById(
      "adjustmentsListContainer",
    );

    // قراءة العناصر الأساسية
    const totalValueSpan = document.getElementById("totalValue");
    const finalTotalSpan = document.getElementById("finalTotal");

    // تعبئة الإجمالي الأصلي
    totalValueSpan.textContent = parseFloat(
      invoice.totalOriginalSYP.toFixed(2),
    ).toLocaleString();

    // مسح قائمة التعديلات
    adjustmentsListContainer.innerHTML = "";

    // معالجة الكوبون
    if (invoice.coupon && invoice.coupon.discountValue !== 0) {
      const couponDiv = document.createElement("div");
      couponDiv.className = "adjustment-item";
      couponDiv.innerHTML = `
        <span>خصم كوبون</span>
        <span>- ${invoice.coupon.discountValue} ${
          invoice.coupon.discountType === "%" ? "%" : "ل.س"
        }</span>
      `;
      adjustmentsListContainer.appendChild(couponDiv);
    }

    // معالجة التعديلات المتعددة
    if (
      invoice.adjustments &&
      Array.isArray(invoice.adjustments) &&
      invoice.adjustments.length > 0
    ) {
      invoice.adjustments.forEach((adj) => {
        const adjDiv = document.createElement("div");
        adjDiv.className = "adjustment-item";
        const isDiscount = adj.type === "-" || adj.type === "-%";
        const sign = isDiscount ? "- " : "+ ";
        const label = isDiscount ? "خصم" : "إضافة";

        adjDiv.innerHTML = `
          <span>${label}</span>
          <span>${sign}${parseFloat(adj.value.toFixed(2)).toLocaleString()} ${
            adj.type.length == 1 || adj.type === "-" ? "ل.س" : "%"
          }</span>
        `;
        adjustmentsListContainer.appendChild(adjDiv);
      });
    }

    // حساب الإجمالي النهائي باستخدام الخوارزمية الذكية
    const calculatedFinalTotal = calculateFinalTotal(
      invoice.totalOriginalSYP,
      invoice.coupon || null,
      invoice.adjustments || [],
    );

    finalTotalSpan.textContent =
      parseFloat(calculatedFinalTotal.toFixed(2)).toLocaleString() + " ل.س";

    const paymentStatus = document.getElementById("paymentStatus");
    if (invoice.payment.status != "unpaid") {
      paymentStatus.style.display = "flex";
      paymentStatus.style.justifyContent = "center";
      paymentStatus.style.alignItems = "center";

      if (invoice.payment.status == "paid-full") {
        const span = document.createElement("span");
        span.textContent = "الفاتورة مدفوعة";
        paymentStatus.appendChild(span);
      } else {
        paymentStatus.style.justifyContent = "space-between";
        const paidSpan = document.createElement("span");
        paidSpan.textContent = `المدفوع: ${parseFloat(invoice.payment.paidSYP.toFixed(2)).toLocaleString()} ل.س`;
        const remainingSpan = document.createElement("span");
        remainingSpan.textContent = `المتبقي: ${parseFloat(invoice.payment.remainingSYP.toFixed(2)).toLocaleString()} ل.س`;
        paymentStatus.appendChild(paidSpan);
        paymentStatus.appendChild(remainingSpan);
      }
    }

    const noteDiv = document.getElementById("noteDiv");
    if (invoice.notes === "" || invoice.notes == null) {
      noteDiv.style.display = "none";
    }
  }

  /**
   * إعداد أزرار الطباعة والتصدير مع نظام تتبع الأخطاء
   */
  /**
   * إعداد أزرار الطباعة والتصدير - نسخة متوافقة مع iOS/Safari
   */
  function setupActionButtons(invoice) {
    const exportBtn = document.getElementById("exportPDF");
    if (!exportBtn) return;

    exportBtn.addEventListener("click", async function () {
      console.log("🚀 بدء التصدير (نسخة التوافق العالي)...");

      if (typeof html2pdf === "undefined") {
        try {
          if (typeof showToast === "function")
            showToast(
              "المكتبة غير محملة، يرجى التحقق من الاتصال.",
              4000,
              "red",
            );
        } catch (e) {}
        return;
      }

      const element = document.querySelector(".invoice-page");

      // إعدادات محسنة لآيفون (توازن بين الجودة واستهلاك الذاكرة)
      const options = {
        margin: 0,
        filename: `3D_Print_SY_${invoice.customerName}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 1.5, // 👈 تقليل السكيل من 2 إلى 1.5 يحل 90% من مشاكل الآيفون
          useCORS: true,
          allowTaint: true,
          letterRendering: false, // تحسين رسم الحروف العربية
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };

      try {
        // في الآيفون، يفضل أحياناً تنفيذ العملية على مراحل لضمان الاستقرار
        const doc = html2pdf().set(options).from(element);

        // جرب الحفظ المباشر أولاً
        await doc.save();

        console.log("🎉 اكتمل التصدير بنجاح!");
      } catch (err) {
        console.error("❌ فشل التصدير، محاولة الطريقة البديلة:", err);

        // طريقة بديلة (Fallback) للآيفون في حال فشل الحفظ التلقائي
        html2pdf()
          .set(options)
          .from(element)
          .outputPdf("bloburl")
          .then(function (bloburl) {
            const newWindow = window.open(bloburl, "_blank");
            if (!newWindow) {
              try {
                if (typeof showToast === "function")
                  showToast(
                    "يرجى السماح بالنوافذ المنبثقة (Pop-ups) لعرض الفاتورة.",
                    6000,
                    "orange",
                  );
              } catch (e) {}
            }
          });
      }
    });

    // زر الطباعة يظل كما هو لأنه مدعوم جيداً
    document
      .getElementById("printInvoice")
      ?.addEventListener("click", () => window.print());
  }
})();
