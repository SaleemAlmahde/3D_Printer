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

// ------------- CUSTOM ORDER DATA -------------
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
    isVisible: 1, // 1 = مرئي ، 0 = مخفي
  },
// ----------------------------------------------

//=============================================
//==------------- KEYCHAIN DATA -------------==
//=============================================

//-------------------------------------------
// ---------------- CARS DATA ---------------
//-------------------------------------------
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
    "images": ["assets/imgs/cars/c1.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
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
    "images": ["assets/imgs/cars/c2.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
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
    "images": ["assets/imgs/cars/c3.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
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
    "images": ["assets/imgs/cars/c4.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
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
    "images": ["assets/imgs/cars/c5.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
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
    "images": ["assets/imgs/cars/c6.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
//-------------------------------------------
//---------------- JOPS DATA ----------------
//-------------------------------------------
   {
    "id": 200,
    "name": "ميدالية مهندس",
    "shortDisc": "ميدالية عبارة Engineer مع شكل طاقية مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/EngH.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
     {
    "id": 201,
    "name": "ميدالية مهندس",
    "shortDisc": "ميدالية عبارة Engineer مع شكل مسنانات مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/EngM.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },   
  {
    "id": 202,
    "name": "ميدالية ادارة اعمال",
    "shortDisc": "ميدالية عبارة Business Administration مع شكل حقيبة مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/BusinessA.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
    {
    "id": 203,
    "name": "ميدالية طبيب اسنان",
    "shortDisc": "ميدالية عبارة Dentist مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/Dentist.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
      {
    "id": 204,
    "name": "ميدالية دكتور ",
    "shortDisc": "ميدالية عبارة Doctor مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/Doctor.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
       {
    "id": 205,
    "name": "ميدالية جرافيك ديزاينر",
    "shortDisc": "ميدالية عبارة Graphic Designer مع شكل يرمز مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/GraphicD.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  }, 
         {
    "id": 206,
    "name": "ميدالية انتيرير ديزاينر",
    "shortDisc": "ميدالية عبارة Interior Designer مع شكل يرمز مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["وظائف"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" },
      { "name": "احمر", "code": "#ba0606" },
      { "name": "فضي", "code": "#6c8bb9" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Jops/InteriorD.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  }, 
//-------------------------------------------
//  -------------- OTHERS DATA --------------
//-------------------------------------------
      {
    "id": 300,
    "name": "ميدالية رائد فضاء",
    "shortDisc": "ميدالية رائد فضاء مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" }
    ],
    "price": 180,
    "storePrice": 140,
    "images": ["assets/imgs/Others/Astronaut.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
        {
    "id": 301,
    "name": "ميدالية افكادو ",
    "shortDisc": "ميدالية شكل افكادو مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "زهري", "code": "#ed92cd" }
    ],
    "price": 180,
    "storePrice": 140,
    "images": ["assets/imgs/Others/Avocado.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
{
    "id": 302,
    "name": "ميدالية برشالونة",
    "shortDisc": "ميدالية شعار نادي برشالونة مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "ازرق", "code": "#004D98" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/Barcelona.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 303,
    "name": "ميدالية كوب قهوة",
    "shortDisc": "كوب قهوة مطبوعة بإستخدام الطباعة ثلاثية الابعاد ميدالية .",
    "categories": ["أخرى"],
    "colors": [
      { "name": "ابيض", "code": "#FFFFFF" }
    ],
    "price": 220,
    "storePrice": 160,
    "images": ["assets/imgs/Others/Coffee.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 304,
    "name": "ميدالية دامبلز",
    "shortDisc": " ميدالية اثقال مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/Dumbbells.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 305,
    "name": "ميدالية حووومص",
    "shortDisc": "ميدالية كلمة حووومص مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "احمر", "code": "#FF0000" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/Hoooms.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 306,
    "name": "ميدالية انا بنت قوية",
    "shortDisc": "ميدالية عبارة 'أنا بنت قوية' مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "زهري", "code": "#FF69B4" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/i'm_Stroning_Girl.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 307,
    "name": "ميدالية علم سوريا",
    "shortDisc": "ميدالية علم سوريا من الجهتين مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "احمر", "code": "#CE1126" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/SyriaFlag.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
   {
    "id": 13,
    "name": "ميدالية الهوية البصرية",
    "shortDisc": "ميدالية الهوية البصرية السورية من الجهتين مطبوعة بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["أخرى"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 160,
    "storePrice": 120,
    "images": ["assets/imgs/Others/SyriaID.webp"],
    "isVisible": 1 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
//-------------------------------------------
//  ------------- Stickers DATA -------------
//-------------------------------------------
   {
    "id":400,
    "name": "ستيكر الهوية البصرية",
    "shortDisc": "ستيكر الهوية البصرية لكفر الجوال مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["ستيكرات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 70,
    "storePrice": 50,
    "images": ["assets/imgs/Stickers/syria_idS.webp"],
    "isVisible": 0 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
     {
    "id":401,
    "name": "ستيكر الهوية البصرية",
    "shortDisc": "ستيكر الهوية البصرية لكفر الجوال مطبوع بإستخدام الطباعة ثلاثية الابعاد.",
    "categories": ["ستيكرات"],
    "colors": [
      { "name": "اسود", "code": "#000000" }
    ],
    "price": 70,
    "storePrice": 50,
    "images": ["assets/imgs/Stickers/syria_idS2.webp"],
    "isVisible": 0 // اذا كانت 1 يظهر في المتجر، إذا كانت 0 لا يظهر في المتجر
  },
];
//------------ STORES DATA -------------
const defaultStores = [
  {
    id: 101,
    name: "For Evar Store",
    phone: "0959887780",
    location: "حمص - الدبلان - شارع المانطيات",
    balance: 0,
    logo: "assets/imgs/ForEvarStore.jpg",
  },
  {
    id: 102,
    name: "Tafasel Homs",
    phone: "0982111220",
    location: "حمص - الحضارة - شارع العشاق دخلة كافيه حبق 100 متر على اليمين",
    balance: 0,
    logo: "assets/imgs/TafaselHoms.jpg",
  },
  {
    id: 103,
    name: "BonBon Homs",
    phone: "0940956026",
    location:"حمص - الحمرا - مقابل دوار البطات",
    balance: 0,
    logo: "assets/imgs/BonBonHoms.jpg",
  },
  {
    id: 104,
    name: "Nafnafi Shop",
    phone: "0945300048",
    location: "حمص - الانشاءات - مقابل سنتر الخواجة داخل سنتر ياسمينة",
    balance: 0,
    logo: "assets/imgs/NafnafiShop.jpg",
  },
    {
    id: 105,
    name: "Flamingo Homs",
    phone: "0932706721",
    location: "حمص - الغوطة - شارع الغوطة",
    balance: 0,
    logo: "assets/imgs/FlamingoHoms.jpg",
  },
];
//------------ ADS DATA -------------
const ads = [
  { id: 0, image: "assets/imgs/Stickers/syria_idS2.webp", link: "" },
  { id: 1, image: "assets/imgs/Stickers/syria_idS2.webp", link: "" },
  { id: 2, image: "assets/imgs/Stickers/syria_idS2.webp", link: "" },
];
//------------ COUPONS DATA -------------
const coupons = [
  {
    id: 0,
    code: "Welcome3DP", // كود القسيمة
    discountType: "%", // - a constant value or %
    discountValue: 35,
    useLimit: 2, // عدد مرات الاستخدام المتاحة
    endDate: "2026-03-01", // تاريخ الانتهاء بصيغة YYYY-MM-DD
  },

];
