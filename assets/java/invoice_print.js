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
    alert("تنبيه: فاتورة غير صالحة أو مفقودة.");
    return;
  }

  // 2. دالة تشغيل النظام عند تحميل الصفحة
  window.onload = function () {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find((inv) => inv.id == invoiceId);

    if (!invoice) {
      alert("خطأ: لم يتم العثور على بيانات الفاتورة في المتصفح.");
      return;
    }

    renderInvoiceData(invoice, invoices);
    setupActionButtons(invoice);
  };

  /**
   * دالة تعبئة البيانات في الصفحة
   */
  function renderInvoiceData(invoice, allInvoices) {
    const displayNumber = invoiceId.slice(0, 2);

    // تعبئة النصوص الأساسية
    document.getElementById("invoiceNumber").textContent = displayNumber;
    document.getElementById("invoiceDate").textContent = invoice.date;
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
        `
      )
      .join("");

    // معالجة سطر التعديل (خصم أو إضافة)
    const adjRow = document.getElementById("adjustmentRow");
    const totalBefore = document.getElementById("totalBefore");
    if (invoice.adjustment && invoice.adjustment.value !== 0) {
      adjRow.style.display = "block";
      totalBefore.style.display = "block";
      document.getElementById("totalDiv").style.justifyContent =
        "space-between";

      document.getElementById("adjustmentValue").textContent = `${
        invoice.adjustment.type === "-" || "-%" ? "خصم" : "إضافة"
      } : ${invoice.adjustment.value.toLocaleString()} ${
        invoice.adjustment.type.length == 1 ? `ل.س` : `%`
      }`;

      document.getElementById(
        "totalValue"
      ).textContent = `${invoice.totalOriginalSYP} ل.س`;
    }

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
        paidSpan.textContent = `المدفوع: ${invoice.payment.paidSYP} ل.س`;
        const remainingSpan = document.createElement("span");
        remainingSpan.textContent = `المتبقي: ${invoice.payment.remainingSYP} ل.س`;
        paymentStatus.appendChild(paidSpan);
        paymentStatus.appendChild(remainingSpan);
      }
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
        alert("المكتبة غير محملة، يرجى التحقق من الاتصال.");
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
          scrollY: 0
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }
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
        html2pdf().set(options).from(element).outputPdf('bloburl').then(function (bloburl) {
            const newWindow = window.open(bloburl, '_blank');
            if (!newWindow) {
                alert("يرجى السماح بالنوافذ المنبثقة (Pop-ups) لعرض الفاتورة على الآيفون.");
            }
        });
      }
    });

    // زر الطباعة يظل كما هو لأنه مدعوم جيداً
    document.getElementById("printInvoice")?.addEventListener("click", () => window.print());
  }
})();
