const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dns').setServers(['8.8.8.8', '8.8.4.4']); // Network Fix

const Product = require('./models/Product'); 

const rawItems = [
    // 👕 MERCH
    { name: "Lanyard / ID Lace", price: 65.00, category: "Merch", imageUrl: "https://ph-live-01.slatic.net/p/9b69fe6f7f9d8c77f74d0fe7c57fd6d1.jpg" },
    { name: "Tote Bags (Canvas)", price: 120.00, category: "Merch", imageUrl: "https://static.wixstatic.com/media/e57753_152cfacbafb44211ae617666ba28accb~mv2.jpg/v1/fill/w_440,h_440,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/e57753_152cfacbafb44211ae617666ba28accb~mv2.jpg" },
    { name: "Vinyl Stickers", price: 20.00, category: "Merch", imageUrl: "https://stickerapp.ca/media/2000x1600/d800bf7ff2/sushi-bot-vinyl-paiheme-social-4-5-2000x1600.png" },
    { name: "Enamel Pins / Acrylic Buttons", price: 45.00, category: "Merch", imageUrl: "https://enamelpinfactory.com/cdn/shop/products/PunkyPins_21215.jpg?v=1565708082&width=1200" },
    { name: "Tumbler / Water Bottle", price: 250.00, category: "Merch", imageUrl: "https://5.imimg.com/data5/SELLER/Default/2024/8/440716565/WN/VF/KK/87329053/cute-cartoon-printed-insulated-coffee-tumbler-600-ml.jpg" },
    { name: "Custom Keychain", price: 50.00, category: "Merch", imageUrl: "https://www.artigifts.com/uploadfile/2024/04/11/20240411161359mqK5Ft.jpg" },

    // ✏️ SUPPLIES
    { name: "Yellow Pad Paper", price: 45.00, category: "Supplies", imageUrl: "https://cdn.store-assets.com/s/377840/i/17085176.jpeg" },
    { name: "Ballpoint Pens", price: 12.00, category: "Supplies", imageUrl: "https://penstore.com/bilder/artiklar/zoom/109198_r_1.jpg?m=1752147372" },
    { name: "Index Cards", price: 20.00, category: "Supplies", imageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98x-llaiycg3lxte09" },
    { name: "Correction Tape", price: 35.00, category: "Supplies", imageUrl: "https://hbw.ph/wp-content/uploads/2017/10/AT-68-pic-3-scaled.jpg" },
    { name: "Highlighters", price: 25.00, category: "Supplies", imageUrl: "https://s7d1.scene7.com/is/image/NewellBrands/244269024_1803277_image_1_r2" },
    { name: "Clear Folders", price: 10.00, category: "Supplies", imageUrl: "https://ph-live-01.slatic.net/p/7baa6e59de15c84396ab499b7fd3dd88.jpg" },
    { name: "Sticky Notes", price: 30.00, category: "Supplies", imageUrl: "https://m.media-amazon.com/images/I/71qoE3z1I0L._AC_UF1000,1000_QL80_.jpg" },

    // 🍛 LUNCH MEALS
    { name: "Chicken Teriyaki Bowl", price: 85.00, category: "Lunch Meals", imageUrl: "https://theheirloompantry.co/wp-content/uploads/2022/09/teriyaki-chicken-bowl-donburi-the-heirloom-pantry-03.jpg" },
    { name: "Chicken Katsu Rice Bowl", price: 85.00, category: "Lunch Meals", imageUrl: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/07/26/DVSP132__chicken-katsu-bowl_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1627312240887.webp" },
    { name: "Sisig Rice with Egg", price: 75.00, category: "Lunch Meals", imageUrl: "https://graceland.ph/wp-content/uploads/2023/05/SIZZLING-SISIG-WITH-EGG.jpg" },
    { name: "Burger Steak Meal", price: 70.00, category: "Lunch Meals", imageUrl: "https://www.ajinomoto.com.ph/ajinomoto-static/web/wp-content/uploads/2021/02/Lean-Beef-Burger-Steak.jpg" },
    { name: "Chicken Fillet with Rice", price: 75.00, category: "Lunch Meals", imageUrl: "https://www.shutterstock.com/image-photo/fried-chicken-rice-hainanese-crispy-600nw-2498122445.jpg" },
    { name: "Shanghai with Rice", price: 65.00, category: "Lunch Meals", imageUrl: "https://delivery.lenoxhotelph.com/wp-content/uploads/2025/02/pork-shanghai1-scaled.jpg" },
    { name: "Chicken Wings with Rice", price: 80.00, category: "Lunch Meals", imageUrl: "https://asset.homechef.com/uploads/meal/plated/2705/homechef_Sambal_Chicken_Wings_Reshoot__2_of_3_.jpg" },
    { name: "Tuna Mayo Rice Bowl", price: 70.00, category: "Lunch Meals", imageUrl: "https://www.wandercooks.com/wp-content/uploads/2025/05/tuna-mayo-rice-bowl-4.jpg" },
    { name: "Spam & Egg Meal", price: 85.00, category: "Lunch Meals", imageUrl: "https://jasmineandtea.com/wp-content/uploads/2021/12/IMG_7501-819x1024.png" },
    { name: "Hotdog & Egg Rice", price: 60.00, category: "Lunch Meals", imageUrl: "https://mykaskitchen.wordpress.com/wp-content/uploads/2012/09/1.png" },

    // 🍟 SNACKS
    { name: "Takoyaki (4-6 pcs)", price: 45.00, category: "Snacks", imageUrl: "https://sudachirecipes.com/wp-content/uploads/2025/08/takoyaki-new-6.jpg" },
    { name: "Nachos with Cheese", price: 50.00, category: "Snacks", imageUrl: "https://wearychef.com/wp-content/uploads/2013/09/homemade-nacho-sauce1.jpg" },
    { name: "Cheesy Bacon Fries", price: 65.00, category: "Snacks", imageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2024_40/2077804/rick-martinez-cheese-fries-2x1-mc-241004.jpg" },
    { name: "French Fries", price: 40.00, category: "Snacks", imageUrl: "https://d3awvtnmmsvyot.cloudfront.net/api/file/4nUe6FuzSEST9rU44Ilr" },
    { name: "Siomai (4 pcs)", price: 35.00, category: "Snacks", imageUrl: "https://thefatbutcherph.com/cdn/shop/articles/Untitled_2cf98e1c-d858-4a03-afab-123344145030.jpg?v=1755828196" },
    { name: "Cheese Sticks", price: 35.00, category: "Snacks", imageUrl: "https://www.unileverfoodsolutions.com.ph/dam/global-ufs/mcos/SEA/calcmenu/recipes/PH-recipes/appetisers/patok-na-negosyo-cheese-sticks/patok-na-negosyo-cheese-sticks-main-header.jpg" },
    { name: "Mini Pancakes", price: 40.00, category: "Snacks", imageUrl: "https://i.ytimg.com/vi/0QhPfzvCZNU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB7_1R5csuJ-wMTavd-4OcNHCDNTw" },
    { name: "Spam & Egg Sandwich", price: 55.00, category: "Snacks", imageUrl: "https://www.spam.com/wp-content/uploads/2019/08/Web_Spam_Simple_Grilled_Cheese_Egg_Spam_Sandwich.jpg" },
    { name: "Korean Sausage & Egg Toast", price: 65.00, category: "Snacks", imageUrl: "https://cf.creatrip.com/original/spot/9515/%ED%95%AB%EB%96%A1%EA%B0%88%EB%B9%84MVP11.JPG?d=1600x900&q=75&f=webp" },
    { name: "Tuna Mayo Sandwich", price: 45.00, category: "Snacks", imageUrl: "https://img.taste.com.au/5UjgjJij/taste/2016/11/tuna-celery-mayo-sandwich-62594-1.jpeg" },

    // 🧋 DRINKS
    { name: "Biscoff Milkshake", price: 95.00, category: "Drinks", imageUrl: "https://cooklikeramsay.com/wp-content/uploads/2025/09/2025-09-22T223610.461Z-gordon-ramsay-biscoff-shake.jpeg" },
    { name: "Strawberry Matcha Latte", price: 85.00, category: "Drinks", imageUrl: "https://www.justonecookbook.com/wp-content/uploads/2025/07/Strawberry-Matcha-Latte-9737-I-3.jpg" },
    { name: "Oreo Cheesecake Drink", price: 90.00, category: "Drinks", imageUrl: "https://personalisedpyjamasshop.com/cdn/shop/files/oreo-cheesecake-milkshake-fragrance-oil-craftiful-fragrance-oils_540x_498626f5-821a-41d1-83a2-18b216580b7b.webp?v=1724179424" },
    { name: "Brown Sugar Milk Tea", price: 75.00, category: "Drinks", imageUrl: "https://takestwoeggs.com/wp-content/uploads/2021/04/Brown-Sugar-Milk-Tea-Boba-Recipe-Takestwoeggs-Easy-Asian-Inspired-Recipes-sq.jpg" },
    { name: "Matcha Float", price: 80.00, category: "Drinks", imageUrl: "https://i.ytimg.com/vi/Dnqj8bSl6d0/maxresdefault.jpg" },
    { name: "Iced Caramel Coffee", price: 70.00, category: "Drinks", imageUrl: "https://www.bhg.com/thmb/UcTbMWKkDYip1DojqgSbfufQRpU=/4000x0/filters:no_upscale():strip_icc()/bhg-Affogatto-Style-Caramel-Iced-Coffee-0s0juRT-4PG97XVeJSnJ9_-3004cfb890654e3e8914a44b70fb35d4.jpg" },
    { name: "Mango Graham Shake", price: 65.00, category: "Drinks", imageUrl: "https://i.ytimg.com/vi/uak2dzj9EZo/maxresdefault.jpg" },
    { name: "Cookies and Cream Frappe", price: 85.00, category: "Drinks", imageUrl: "https://recipesbyclare.com/assets/images/1745700481890-pr6fy2pw.webp" },
    { name: "Yakult Fruit Soda", price: 55.00, category: "Drinks", imageUrl: "https://tastywithlara.com/wp-content/uploads/2025/06/watermelon-grape-yakult-cooler-2.webp" }
];

// Add 20 stock to everything so people can buy them!
const fullInventory = rawItems.map(item => ({
    ...item,
    stock: 20 
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campushub')
.then(async () => {
    console.log("📦 Connected to MongoDB!");
    
    console.log("🧹 Wiping old test products...");
    await Product.deleteMany({}); // Clears out your old tests
    
    console.log(`🚀 Injecting ${fullInventory.length} new items with unique images...`);
    await Product.insertMany(fullInventory);
    
    console.log("✅ Database seeded successfully!");
    process.exit();
}).catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});