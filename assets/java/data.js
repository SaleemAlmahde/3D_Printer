//  {
//  id: 1,
//     name: "ميدالية سيارة تويوتا",
//     shortDisc: "ميدالية ثلاثية الأبعاد بشعار تويوتا بتصميم متين وخفيفة الوزن.",
//     categories: ["سيارة", "ميدالية مطبوعة ثلاثي الأبعاد"],
//     colors: [
//       { name: "ازرق", code: "#0000FF" },
//       { name: "ازرق فاتح", code: "#5DADEC" },
//       { name: "كحلي", code: "#001F3F" },
//       { name: "ابيض", code: "#FFFFFF" },
//       { name: "اسود", code: "#000000" },
//       { name: "زهري", code: "#FF69B4" },
//       { name: "بنفسجي", code: "#800080" },
//       { name: "بني", code: "#8B4513" },
//       { name: "بيج", code: "#F5F5DC" },
//       { name: "اخضر غامق", code: "#006400" },
//       { name: "اخضر فيروزي", code: "#40E0D0" },
//       { name: "اصفر", code: "#FFFF00" },
//       { name: "دهبي", code: "#D4AF37" },
//       { name: "رمادي", code: "#808080" },
//       { name: "فضي", code: "#C0C0C0" },
//       { name: "احمر غامق", code: "#8B0000" },
//       { name: "احمر", code: "#FF0000" },
//       { name: "برتقالي", code: "#FFA500" },
//     ],
//     price: 132,
//     storePrice: 10,
//     images: ["assets/imgs/try.jpg"],
//   }

const finalBaseProducts = [
  {
    id: "CUSTOM_ORDER", // معرّف فريد وغير رقمي لتجنب التعارض
    name: "🛠️ طلب منتج مخصص", // اسم واضح يظهر للعميل
    shortDisc: "لم تجد ما تبحث عنه؟ اطلب تصميمًا أو منتجًا خاصًا بك الآن.",
    categories: [], // يمكن وضعه في تصنيف "خدمات"
    colors: [], // لا يوجد ألوان محددة مسبقًا
    price: 0, // السعر يبدأ من صفر حتى يتم تحديد المواصفات
    images: ["assets/imgs/try.jpg"], // صورة توضيحية لطلب مخصص
    isCustomOrder: true, // 🚩 العلامة الرئيسية لتمييزه
  },
    {
    "id": 1,
    "name": "ميدالية سيارة KIA (الشعار القديم)",
    "shortDisc": "ميدالية شعار سيارة KIA (الشعار القديم) مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c1.webp"]
  },
    {
    "id": 2,
    "name": "ميدالية سيارة BMW",
    "shortDisc": "ميدالية شعار سيارة BMW مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c2.webp"]
  },
    {
    "id": 3,
    "name": "ميدالية سيارة فوكس فاجن",
    "shortDisc": "ميدالية شعار سيارة فوكس فاجن مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c3.webp"]
  },
      {
    "id": 4,
    "name": "ميدالية سيارة اودي",
    "shortDisc": "ميدالية شعار سيارة اودي مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c4.webp"]
  },
  {
    "id": 5,
    "name": "ميدالية سيارة مرسيدس",
    "shortDisc": "ميدالية شعار سيارة مرسيدس مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c5.webp"]
  },
   {
    "id": 6,
    "name": "ميدالية سيارة موستبيشي",
    "shortDisc": "ميدالية شعار سيارة موستبيشي مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["سيارات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 180,
    "storePrice": 120,
    "images": ["assets/imgs/cars/c6.webp"]
  },

];

// STORSE DATA ----------------------------
const defaultStores = [
  {
    id: 101,
    name: "متجر الفا للمطبوعات",
    phone: "ؤسؤسؤسؤ",
    location: "دمشق",
    balance: 0,
    logo: "assets/imgs/Untitled-11.png",
  },
  {
    id: 102,
    name: "نقطة بيع المهندس",
    phone: "0998765432",
    location: "حلب",
    balance: 0,
    logo: "assets/imgs/Untitled-11.png",
  },
  {
    id: 103,
    name: "مكتبة الإبداع الرقمي",
    phone: "0995551112",
    location: "حمص",
    balance: 0,
    logo: "assets/imgs/Untitled-33.png",
  },
  {
    id: 104,
    name: "مكتبة jg الرقمي",
    phone: "0995551112",
    location: "حمص",
    balance: 0,
    logo: "assets/imgs/Untitled-22.png",
  },
  {
    id: 105,
    name: "نقطة بيع المهندس",
    phone: "0998765432",
    location: "حلب",
    balance: 0,
    logo: "assets/imgs/Untitled-11.png",
  },
];

const ads = [
  { id: 0, image: "assets/imgs/try.jpg", link: "" },
  { id: 1, image: "assets/imgs/Chicken_Alfredo.jpg", link: "" },
  { id: 2, image: "assets/imgs/Spaghetti_Bolognese.jpg", link: "" },
];

const coupons = [
  {
    id: 0,
    code: "ewkjfjewklfjew",
    discountType: "%", // - a constant value or %
    discountValue: 5,
    useLimit: 5, // عدد مرات الاستخدام المتاحة
    endDate: "2026-07-01", // تاريخ الانتهاء بصيغة YYYY-MM-DD
  },
  {
    id: 1,
    code: "ewkjfjewسسيklfjew",
    discountType: "%", // - a constant value or %
    discountValue: 5,
    useLimit: 5, // عدد مرات الاستخدام المتاحة
    endDate: "2026-07-01", // تاريخ الانتهاء بصيغة YYYY-MM-DD
  },
  {
    id: 2,
    code: "ewkjfؤؤjewسسيklfjew",
    discountType: "%", // - a constant value or %
    discountValue: 5,
    useLimit: 5, // عدد مرات الاستخدام المتاحة
    endDate: "2026-07-01", // تاريخ الانتهاء بصيغة YYYY-MM-DD
  },
];
