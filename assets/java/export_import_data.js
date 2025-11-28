/**
 * تحفظ نسخة احتياطية من البيانات الديناميكية للمدير (الفواتير والمتاجر المُضافة) 
 * إلى ملف JSON يمكن تنزيله محلياً.
 */
function exportAdminData() {
    // 1. تجميع البيانات الهامة من localStorage
    const dataToExport = {
        // يتم تجميع مصفوفات الفواتير والمتاجر (التي تم تعديلها أو إضافتها)
        invoices: JSON.parse(localStorage.getItem('invoices')) || [],
        stores: JSON.parse(localStorage.getItem('pointsOfSale')) || [],
        // ... يمكنك إضافة أي مفاتيح أخرى تحفظها في localStorage ...
    };

    // 2. تحويل كائن البيانات إلى نص JSON مهيأ ليكون قابلاً للقراءة
    // null, 2 يجعل النص منسقاً بأربعة مسافات لسهولة قراءته
    const jsonString = JSON.stringify(dataToExport, null, 2); 
    
    // 3. إنشاء كائن Blob (Binary Large Object)
    // هذا الكائن يمثل محتوى الملف الذي سيتم تنزيله
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 4. إنشاء رابط للتنزيل
    // URL.createObjectURL ينشئ رابط مؤقت في الذاكرة لتنزيل الـ Blob
    const url = URL.createObjectURL(blob);
    
    // 5. إنشاء عنصر <a> مخفي لتنفيذ عملية التحميل (Download)
    const a = document.createElement('a');
    a.href = url;
    
    // تحديد اسم الملف، مع تاريخ اليوم
    a.download = `AdminDataBackup_${new Date().toISOString().slice(0, 10)}.json`;
    
    // 6. تنفيذ عملية النقر والتحميل
    document.body.appendChild(a);
    a.click();
    
    // 7. تنظيف العناصر والروابط المؤقتة
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("✅ تم حفظ نسخة احتياطية من بيانات المدير بنجاح!");
}

/**
 * تستعيد البيانات الديناميكية للمدير من ملف JSON محدد وتقوم بتحديث localStorage.
 */
function importAdminData() {
    // 1. إنشاء عنصر إدخال ملفات (input type="file") بشكل ديناميكي ومخفي
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // قبول ملفات JSON فقط

    // 2. معالجة حدث اختيار الملف
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return; // إذا لم يختر المستخدم ملفاً

        const reader = new FileReader(); // كائن لقراءة محتويات الملفات

        // يتم تشغيله بعد اكتمال قراءة الملف
        reader.onload = function(e) {
            try {
                // تحويل محتوى الملف النصي (JSON String) إلى كائن JavaScript
                const importedData = JSON.parse(e.target.result);
                
                // 3. التحقق من صحة المفاتيح وتحديث localStorage
                
                // استعادة الفواتير
                if (importedData.invoices && Array.isArray(importedData.invoices)) {
                    localStorage.setItem('invoices', JSON.stringify(importedData.invoices));
                }
                
                // استعادة المتاجر التي أضافها المدير فقط (تجنباً للتكرار)
                // يتم حفظ البيانات المستوردة للمتاجر فوق بيانات المتاجر المفقودة
                if (importedData.stores && Array.isArray(importedData.stores)) {
                    localStorage.setItem('pointsOfSale', JSON.stringify(importedData.stores));
                }
                // ... تحديث باقي المفاتيح ...

                alert("✅ تم استعادة البيانات بنجاح! سيتم إعادة تحميل الصفحة.");
                window.location.reload();
                
            } catch (error) {
                alert("❌ خطأ: فشل قراءة أو تحليل ملف JSON. تأكد أنه ملف صحيح.");
                console.error("Import Error:", error);
            }
        };
        
        // بدء عملية قراءة الملف كنص
        reader.readAsText(file); 
    };
    
    // 4. فتح نافذة اختيار الملفات (تشغيل عملية الإدخال)
    input.click();
}