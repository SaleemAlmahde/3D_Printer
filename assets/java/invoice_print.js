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
    // حساب رقم العرض بناءً على الترتيب الزمني
    const displayNumber =
      invoiceId;

    // تعبئة النصوص الأساسية
    document.getElementById("invoiceNumber").textContent = displayNumber;
    document.getElementById("invoiceDate").textContent = invoice.date;
    document.getElementById("customerName").textContent = invoice.customerName;
    document.getElementById("customerPhone").textContent = invoice.phone;
    document.getElementById("customerCity").textContent = invoice.city;
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
                <td>${p.note || "-"}</td>
                <td>${p.quantity}</td>
                <td>${p.priceSYP.toLocaleString()}</td>
                <td>${(p.quantity * p.priceSYP).toLocaleString()}</td>
            </tr>
        `
      )
      .join("");

    // معالجة سطر التعديل (خصم أو إضافة)
    const adjRow = document.getElementById("adjustmentRow");
    if (invoice.adjustment && invoice.adjustment.value !== 0) {
      adjRow.style.display = "block";
      document.getElementById("adjustmentValue").textContent = `${
        invoice.adjustment.type === "discount" ? "خصم" : "إضافة"
      }: ${invoice.adjustment.value.toLocaleString()} ل.س`;
    }
  }

  /**
   * إعداد أزرار الطباعة والتصدير مع نظام تتبع الأخطاء
   */
  function setupActionButtons(invoice) {
    console.log("🛠️ جاري إعداد أزرار العمليات...");

    // 1. زر الطباعة
    const printBtn = document.getElementById("printInvoice");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        console.log("🖨️ بدء عملية الطباعة العادية...");
        window.print();
      });
    }

    // 2. زر التصدير إلى PDF
    const exportBtn = document.getElementById("exportPDF");
    if (exportBtn) {
      exportBtn.addEventListener("click", async function () {
        console.log("🚀 تم الضغط على زر تصدير PDF");

        // التحقق من وجود المكتبة
        if (typeof html2pdf === "undefined") {
          console.error("❌ خطأ: مكتبة html2pdf غير معرفة في الصفحة!");
          alert("تعذر العثور على مكتبة التصدير، تأكد من اتصال الإنترنت.");
          return;
        }
        console.log("✅ مكتبة html2pdf موجودة");

        const element = document.querySelector(".invoice-page");
        if (!element) {
          console.error("❌ خطأ: لم يتم العثور على العنصر .invoice-page");
          return;
        }
        console.log("✅ تم العثور على عنصر الفاتورة بنجاح");

        const options = {
          margin: 5,
          filename: `Invoice_${invoice.customerName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true, // السماح بمشاركة الموارد عبر الأصول
            allowTaint: true, // السماح بمعالجة الصور "الملوثة" أمنياً
            logging: true,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: "avoid-all" },
        };

        console.log("📦 إعدادات التصدير جاهزة، يبدأ التحويل الآن...");

        try {
          // تنفيذ التصدير مع تتبع الوعود (Promises)
          await html2pdf().set(options).from(element).toPdf().get("pdf").save();
          console.log("🎉 تمت عملية الحفظ بنجاح!");
        } catch (err) {
          console.error("❌ فشل التصدير في المرحلة النهائية:", err);
          alert("حدث خطأ تقني أثناء توليد ملف PDF");
        }
      });
    } else {
      console.warn("⚠️ تحذير: لم يتم العثور على زر ID: exportPDF في HTML");
    }
  }
})();
