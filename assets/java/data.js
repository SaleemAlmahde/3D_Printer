const finalBaseProducts = [
  {
    id: "CUSTOM_ORDER", // معرّف فريد وغير رقمي لتجنب التعارض
    name: "🛠️ طلب منتج مخصص", // اسم واضح يظهر للعميل
    shortDisc: "لم تجد ما تبحث عنه؟ اطلب تصميمًا أو منتجًا خاصًا بك الآن.",
    categories: [], // يمكن وضعه في تصنيف "خدمات"
    colors: [], // لا يوجد ألوان محددة مسبقًا
    price: 0, // السعر يبدأ من صفر حتى يتم تحديد المواصفات
    images: ["assets/imgs/try.jpg"], // صورة توضيحية لطلب مخصص
    isCustomOrder: true // 🚩 العلامة الرئيسية لتمييزه
  },
  {
    id: 1,
    name: "ميدالية سيارة تويوتا",
    shortDisc: "ميدالية ثلاثية الأبعاد بشعار تويوتا بتصميم متين وخفيفة الوزن.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg"]
  },
  {
    id: 2,
    name: "ميدالية سيارة اودي",
    shortDisc: "ميدالية ثلاثية الأبعاد بشعار أودي بتفاصيل دقيقة ولمسة نهائية ناعمة.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: [ "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/try.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 3,
    name: "ميدالية سيارة هوندا",
    shortDisc: "ميدالية شعار هوندا ثلاثية الأبعاد بتصميم كلاسيكي ومتين.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/Chicken_Alfredo.jpg", "assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg"]
  },
  {
    id: 4,
    name: "ميدالية سيارة هونداي",
    shortDisc: "ميدالية شعار هيونداي بطباعة ثلاثية الأبعاد بتشطيب قوي ومقاوم للخدش.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 5,
    name: "ميدالية سيارة مرسيدس",
    shortDisc: "ميدالية بشعار مرسيدس بتصميم أنيق وتفاصيل دقيقة مناسبة كهدايا فاخرة.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 6,
    name: "ميدالية سيارة بي ام دابليو",
    shortDisc: "ميدالية شعار BMW بتفاصيل بارزة ولمسة نهائية لامعة.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 7,
    name: "ميدالية سيارة فورد",
    shortDisc: "ميدالية شعار فورد بطباعة ثلاثية الأبعاد مقاومة للتآكل وخفيفة.",
    categories: ["ستيكر", "سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/Sushi_Roll.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 8,
    name: "ميدالية سيارة ميتسوبيشي",
    shortDisc: "ميدالية شعار ميتسوبيشي بتصميم هندسي واضح وخامات مطبوعة عالية الجودة.",
    categories: ["ستيكر", "سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 9,
    name: "ميدالية سيارة كيا",
    shortDisc: "ميدالية شعار كيا بتصميم عصري وخيارات ألوان متعددة للطباعة.",
    categories: ["ستيكر", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 10,
    name: "ميدالية سيارة فوكسفاجن",
    shortDisc: "ميدالية شعار فولكس فاجن مطبوعة بدقة مع حواف ناعمة وقابلة للتخصيص.",
    categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  }
];

const defaultStores = [
    { id: 101,
      name: "متجر الفا للمطبوعات",
      phone: "ؤسؤسؤسؤ",
      location: "دمشق",
      balance: 0,
      logo:"assets/imgs/Untitled-11.png"
    },
    { id: 102,
      name: "نقطة بيع المهندس",
      phone: "0998765432",
      location: "حلب",
      balance: 0,
      logo:"assets/imgs/Untitled-11.png"
    },
    { id: 103,
      name: "مكتبة الإبداع الرقمي",
      phone: "0995551112",
      location: "حمص",
      balance: 0,
      logo:"assets/imgs/Untitled-33.png"
    },
    { id: 104,
      name: "مكتبة jg الرقمي",
      phone: "0995551112",
      location: "حمص",
      balance: 0,
      logo:"assets/imgs/Untitled-22.png"
    },
    { id: 105,
      name: "نقطة بيع المهندس",
      phone: "0998765432",
      location: "حلب",
      balance: 0,
      logo:"assets/imgs/Untitled-11.png"
    }
];

const ads = [
  {id: 0,
    image: "assets/imgs/try.jpg",
    link: ""
  },
  {id: 1,
    image: "assets/imgs/Chicken_Alfredo.jpg",
    link: ""
  },
  {id: 2,
    image: "assets/imgs/Spaghetti_Bolognese.jpg",
    link: ""
  },
]