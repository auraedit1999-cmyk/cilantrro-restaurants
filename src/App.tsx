import { useState, useEffect, useRef, useCallback } from "react";

// ─── MENU DATA ────────────────────────────────────────────────────────────────
type MenuCategory =
  | "Continental Starters" | "Oriental Starters" | "Soups"
  | "Salads" | "Sandwiches" | "Pasta"
  | "Indian Mains" | "Oriental Mains" | "Rice & Noodles"
  | "Biryani" | "Breads" | "Drinks";

interface MenuItem { name: string; price: number; desc: string; veg: boolean; popular?: boolean; }

const MENU: Record<MenuCategory, MenuItem[]> = {
  "Continental Starters": [
    { name: "Hand Cut Potato Wedges With Chipotle Sauce", price: 325, desc: "Crispy hand-cut wedges with smoky chipotle dip", veg: true },
    { name: "Nachos With Salsa", price: 325, desc: "Tortilla chips loaded with fresh tomato salsa", veg: true },
    { name: "Veg Shawarma", price: 325, desc: "Grilled veggies rolled in warm flatbread with garlic sauce", veg: true },
    { name: "French Fries", price: 195, desc: "Classic golden fries, lightly salted", veg: true, popular: true },
    { name: "Mushroom Bell Pepper Crostini", price: 335, desc: "Toasted bread with sautéed mushrooms and roasted peppers", veg: true },
    { name: "Quesadilla (Veg)", price: 325, desc: "Grilled flour tortilla with cheese and seasoned vegetables", veg: true },
    { name: "Quesadilla (Chicken)", price: 399, desc: "Grilled flour tortilla with spiced chicken and cheese", veg: false },
    { name: "Mexican Wrap (Veg)", price: 325, desc: "Soft wrap filled with grilled veggies, beans and sour cream", veg: true },
    { name: "Mexican Wrap (Chicken)", price: 399, desc: "Soft wrap with grilled chicken, salsa and jalapeños", veg: false },
    { name: "Barbeque Chicken Wings", price: 399, desc: "Slow-cooked wings glazed in smoky BBQ sauce", veg: false, popular: true },
    { name: "Country Fried Chicken", price: 399, desc: "Southern-style crispy fried chicken with honey mustard", veg: false },
    { name: "Panco Crumbed Fish Batons With Tartar Sauce", price: 399, desc: "Crispy panko-coated fish strips with classic tartar", veg: false },
    { name: "Chicken Shawarma", price: 399, desc: "Marinated chicken with garlic sauce and pickles in flatbread", veg: false, popular: true },
  ],
  "Oriental Starters": [
    { name: "Mushroom & Cheddar Cheese Dimsum", price: 350, desc: "Steamed dumplings with mushroom-cheddar filling", veg: true, popular: true },
    { name: "Shiitake & Pokchoi SuiMui", price: 300, desc: "Open-top steamed dumplings with shiitake and bok choy", veg: true },
    { name: "Cottage Cheese Dumpling", price: 300, desc: "Steamed paneer-filled dumplings with spicy dip", veg: true },
    { name: "Vegetable Crystal Dumpling", price: 320, desc: "Translucent rice-skin dumplings with garden veggies", veg: true },
    { name: "Lotus Stem & Water Chestnut Dumpling", price: 350, desc: "Delicate lotus stem filling in steamed wrappers", veg: true },
    { name: "Chicken SuiMui", price: 350, desc: "Open-top chicken dumplings with scallions", veg: false },
    { name: "Chicken Gyoza", price: 350, desc: "Pan-fried Japanese dumplings with ponzu dipping sauce", veg: false, popular: true },
    { name: "Prawn Har Gao", price: 420, desc: "Classic Cantonese shrimp dumplings, steamed to order", veg: false },
    { name: "Pickled Veg & Cottage Cheese Bao", price: 270, desc: "Steamed bao buns with tangy pickled veg and paneer", veg: true },
    { name: "Crunchy Fried Chicken Bao", price: 290, desc: "Soft bao with crispy fried chicken and sriracha mayo", veg: false },
    { name: "Spring Roll", price: 349, desc: "Crispy rolls stuffed with seasoned vegetables", veg: true },
    { name: "Shanghai Potato Chilli", price: 349, desc: "Crispy potatoes tossed in Shanghai chilli sauce", veg: true },
    { name: "Crispy Honey Chilli Lotus Root", price: 375, desc: "Fried lotus root in sweet-heat honey chilli glaze", veg: true },
    { name: "Paneer (Chilli/Hunan/Oyster/Pepper)", price: 375, desc: "Wok-tossed cottage cheese in your choice of sauce", veg: true, popular: true },
    { name: "Crispy Corn", price: 375, desc: "Golden-fried sweet corn tossed with spices and herbs", veg: true, popular: true },
    { name: "Chinese Platter (Veg)", price: 799, desc: "Selection of chef's favourite veg starters — great for sharing", veg: true },
    { name: "Chicken Spring Roll", price: 375, desc: "Crispy rolls with seasoned minced chicken filling", veg: false },
    { name: "Drums of Heaven", price: 425, desc: "Crispy chicken lollipops in sticky oriental sauce", veg: false, popular: true },
    { name: "Chicken (Chilli/BBQ/Hunan/Smoked/Teriyaki)", price: 425, desc: "Wok-tossed chicken in your choice of classic oriental sauce", veg: false },
  ],
  "Soups": [
    { name: "Tomato Basil Soup", price: 180, desc: "Velvety roasted tomato with fresh basil and cream", veg: true, popular: true },
    { name: "Tom Yum (Veg)", price: 180, desc: "Thai lemongrass broth with mushrooms and galangal", veg: true },
    { name: "Tom Yum (Non-Veg)", price: 190, desc: "Spicy Thai broth with chicken and prawn", veg: false },
    { name: "Tom Kha (Veg)", price: 180, desc: "Creamy coconut milk soup with lemongrass and lime", veg: true },
    { name: "Tom Kha (Non-Veg)", price: 190, desc: "Rich coconut broth with chicken and Thai herbs", veg: false },
    { name: "Hot & Sour (Veg)", price: 180, desc: "Classic Indo-Chinese with vinegar, tofu and white pepper", veg: true },
    { name: "Hot & Sour (Non-Veg)", price: 190, desc: "Tangy broth with chicken, egg and white pepper", veg: false, popular: true },
    { name: "Manchow (Veg)", price: 180, desc: "Thick Indo-Chinese soup topped with crispy noodles", veg: true },
    { name: "Manchow (Non-Veg)", price: 190, desc: "Hearty Manchow with chicken and fried noodle garnish", veg: false },
    { name: "Tibetan Thukpa (Veg)", price: 180, desc: "Himalayan noodle soup with seasonal vegetables", veg: true },
    { name: "Tibetan Thukpa (Non-Veg)", price: 190, desc: "Warming noodle broth with tender chicken pieces", veg: false },
    { name: "Clear Soup (Veg)", price: 180, desc: "Light vegetable broth with delicate flavours", veg: true },
    { name: "Clear Soup (Non-Veg)", price: 190, desc: "Light chicken broth with seasonal greens", veg: false },
    { name: "Sweet Corn Soup (Veg)", price: 180, desc: "Creamy sweet corn with egg-drop and spring onions", veg: true },
    { name: "Sweet Corn Soup (Non-Veg)", price: 190, desc: "Sweet corn with shredded chicken and egg drops", veg: false },
    { name: "Lemon Coriander (Veg)", price: 180, desc: "Zesty citrus broth with fresh coriander and vegetables", veg: true },
    { name: "Lemon Coriander (Non-Veg)", price: 190, desc: "Bright lemony broth with chicken and fresh herbs", veg: false },
    { name: "Peking Soup (Veg)", price: 180, desc: "Traditional Peking-style soup with tofu and mushrooms", veg: true },
    { name: "Peking Soup (Non-Veg)", price: 190, desc: "Classic Peking broth with chicken and egg drops", veg: false },
    { name: "Mushroom Cappuccino", price: 195, desc: "Velvety mushroom cream soup served cappuccino-style", veg: true, popular: true },
  ],
  "Salads": [
    { name: "Fresh Garden Green Salad", price: 175, desc: "Seasonal greens with house vinaigrette", veg: true },
    { name: "Cobb Salad", price: 175, desc: "Classic American salad with eggs, cheese and crispy croutons", veg: true },
    { name: "Corn Salad", price: 210, desc: "Roasted corn with peppers, herbs and lime dressing", veg: true, popular: true },
    { name: "Som Tum Salad", price: 250, desc: "Thai green papaya salad with peanuts and chilli-lime dressing", veg: true },
    { name: "Caesar Salad (Veg)", price: 270, desc: "Romaine, parmesan and house-made Caesar dressing", veg: true },
    { name: "Caesar Salad (Non-Veg)", price: 290, desc: "Caesar with grilled chicken strips and croutons", veg: false },
    { name: "Greek Salad (Veg)", price: 270, desc: "Tomato, cucumber, olives, feta and oregano dressing", veg: true },
    { name: "Greek Salad (Non-Veg)", price: 290, desc: "Greek salad topped with grilled prawns", veg: false },
    { name: "Raita (Boondi/Veg/Aloo/Pineapple/Mint)", price: 170, desc: "Chilled yogurt accompaniment in your choice of style", veg: true },
    { name: "Papad (Plain/Masala) 2 Pcs", price: 110, desc: "Crispy lentil wafers, plain or spiced", veg: true },
  ],
  "Sandwiches": [
    { name: "Spinach Corn & Cheese", price: 245, desc: "Grilled sandwich with spinach, corn and melted cheese. Served with fries & salad", veg: true },
    { name: "Barbecued Cottage Cheese", price: 275, desc: "Smoky BBQ paneer with peppers. Served with fries & salad", veg: true },
    { name: "Barbecued Chicken", price: 295, desc: "Smoky BBQ chicken breast with fresh veggies. Served with fries & salad", veg: false, popular: true },
    { name: "Grilled Chicken & Cheese", price: 295, desc: "Herbed chicken with melted cheese. Served with fries & salad", veg: false },
    { name: "Chicken Tikka", price: 295, desc: "Spiced tandoori chicken in toasted bread. Served with fries & salad", veg: false },
  ],
  "Pasta": [
    { name: "Tortellini / Agnolotti / Ravioli", price: 340, desc: "House-made stuffed pasta in sage butter sauce", veg: true, popular: true },
    { name: "Tortellini, Vegetable / Porcini", price: 520, desc: "Premium stuffed pasta with porcini — prawn/pork on request", veg: true },
  ],
  "Indian Mains": [
    { name: "Aloo Methi", price: 315, desc: "Potatoes cooked with fresh fenugreek leaves and spices", veg: true },
    { name: "Kathal Amritsari (seasonal)", price: 315, desc: "Raw jackfruit cooked Amritsari-style with bold spices", veg: true },
    { name: "Aloo Gobhi Matar", price: 315, desc: "Potato, cauliflower and peas in classic masala", veg: true },
    { name: "Dum Aloo (Kashmiri/Banarasi)", price: 315, desc: "Baby potatoes slow-cooked in rich aromatic gravy", veg: true },
    { name: "Bhindi Do Pyaza / Masala", price: 315, desc: "Okra stir-fried with double onions or masala", veg: true },
    { name: "Dal Yellow Tadka", price: 315, desc: "Yellow lentils tempered with cumin, garlic and ghee", veg: true, popular: true },
    { name: "Dal Makhani", price: 349, desc: "Slow-simmered black lentils in butter and cream, overnight cooked", veg: true, popular: true },
    { name: "Veg Kolhapuri", price: 349, desc: "Mixed vegetables in fiery Kolhapuri masala", veg: true },
    { name: "Mushroom (Do Pyaza / Matar Masala / Kadhai)", price: 425, desc: "Button mushrooms in your choice of rich gravy", veg: true },
    { name: "Kofta (Malai / Veg)", price: 349, desc: "Vegetable or cream-filled dumplings in makhani sauce", veg: true },
    { name: "Paneer (Makhani/Lababdar/Kadhai/Mirch)", price: 389, desc: "Fresh cottage cheese in your choice of classic gravy", veg: true, popular: true },
    { name: "Matar Paneer", price: 359, desc: "Paneer and green peas in spiced tomato gravy", veg: true },
    { name: "Palak Paneer", price: 399, desc: "Creamed spinach with soft paneer cubes", veg: true },
    { name: "Paneer Tikka Masala", price: 399, desc: "Tandoor-charred paneer in rich tomato-onion masala", veg: true, popular: true },
    { name: "Palak Corn Malai", price: 399, desc: "Sweet corn in creamy spinach and malai gravy", veg: true },
    { name: "Egg Curry", price: 349, desc: "Boiled eggs in spiced onion-tomato masala", veg: false },
    { name: "Chicken with Bone (Makhani/Lababdar/etc)", price: 399, desc: "Bone-in chicken in your choice of rich Indian gravy", veg: false },
    { name: "Chicken without Bone", price: 449, desc: "Boneless chicken in makhani, kadhai or lababdar", veg: false, popular: true },
    { name: "Bhuna Chicken", price: 510, desc: "Slow bhuna'd chicken in thick, intensely spiced masala", veg: false },
    { name: "Rara Chicken", price: 530, desc: "Chicken cooked with minced meat in bold Rara masala", veg: false },
    { name: "Chicken Tikka Masala", price: 499, desc: "Tandoor-grilled chicken in creamy tomato-cashew sauce", veg: false, popular: true },
  ],
  "Oriental Mains": [
    { name: "Veg Dumpling In Soya Garlic Sauce", price: 315, desc: "Steamed dumplings tossed in umami soya garlic sauce", veg: true },
    { name: "Exotic Vegetables", price: 315, desc: "Seasonal Asian vegetables wok-tossed in black bean sauce", veg: true },
    { name: "Cottage Cheese / Tofu", price: 349, desc: "Paneer or tofu in your choice of oriental sauce", veg: true },
    { name: "Cottage Cheese Chilli", price: 390, desc: "Wok-tossed paneer with green chillies and bell peppers", veg: true, popular: true },
    { name: "Thai Curry Red/Green (Veg)", price: 399, desc: "Creamy coconut Thai curry with seasonal vegetables", veg: true, popular: true },
    { name: "Chicken (Chilli/Black Pepper/Soya Ginger)", price: 390, desc: "Boneless chicken wok-tossed in your choice of oriental sauce", veg: false, popular: true },
    { name: "Colombo Fish Curry", price: 410, desc: "Sri Lankan-style fish curry with coconut and tamarind", veg: false },
    { name: "Prawns (Chilli/Black Pepper/Butter Garlic)", price: 590, desc: "Tiger prawns in your choice of bold wok sauce", veg: false },
    { name: "Thai Curry Red/Green (Chicken)", price: 449, desc: "Rich coconut curry with tender chicken and Thai herbs", veg: false },
    { name: "Thai Curry Red/Green (Prawns)", price: 599, desc: "Aromatic Thai curry with fresh prawns and kaffir lime", veg: false, popular: true },
  ],
  "Rice & Noodles": [
    { name: "Jasmine Rice", price: 249, desc: "Fragrant steamed Thai jasmine rice", veg: true },
    { name: "Thai Pineapple Fried Rice (Veg)", price: 290, desc: "Wok-fried rice with pineapple, cashews and vegetables", veg: true, popular: true },
    { name: "Thai Pineapple Fried Rice (Chicken)", price: 340, desc: "Pineapple rice with chicken served in a pineapple shell", veg: false },
    { name: "Thai Pineapple Fried Rice (Prawns)", price: 390, desc: "Pineapple fried rice with tiger prawns", veg: false },
    { name: "Fried Rice (Veg)", price: 249, desc: "Wok-tossed rice with seasonal vegetables and soya", veg: true },
    { name: "Fried Rice (Chicken)", price: 349, desc: "Classic fried rice with egg and chicken", veg: false },
    { name: "Fried Rice (Prawns)", price: 449, desc: "Prawn fried rice with spring onions and soya", veg: false },
    { name: "Udon Noodles (Veg)", price: 249, desc: "Thick Japanese udon noodles in umami broth with vegetables", veg: true },
    { name: "Udon Noodles (Chicken)", price: 349, desc: "Udon noodles with chicken in dashi-soya broth", veg: false },
    { name: "Udon Noodles (Prawns)", price: 449, desc: "Udon with tiger prawns in light sesame broth", veg: false },
    { name: "Noodles — Hakka/Chilli Garlic/Pad Thai (Veg)", price: 249, desc: "Wok-tossed noodles with vegetables in your choice of style", veg: true, popular: true },
    { name: "Noodles — Chicken", price: 349, desc: "Wok noodles with chicken in classic oriental style", veg: false },
    { name: "Noodles — Prawns", price: 449, desc: "Stir-fried noodles with prawns", veg: false },
    { name: "Stir Fried Bowls with Rice/Noodles (Veg)", price: 299, desc: "Seasonal vegetables stir-fried served with rice or noodles", veg: true },
    { name: "Stir Fried Bowls with Rice/Noodles (Chicken)", price: 399, desc: "Wok-tossed chicken served over rice or noodles", veg: false },
    { name: "Stir Fried Bowls with Rice/Noodles (Prawns)", price: 499, desc: "Stir-fried prawns over jasmine rice or noodles", veg: false },
  ],
  "Biryani": [
    { name: "Steamed Rice", price: 225, desc: "Plain basmati steamed to perfection", veg: true },
    { name: "Jeera Pulao", price: 250, desc: "Cumin-tempered basmati with whole spices", veg: true },
    { name: "Subz Chilman Biryani", price: 350, desc: "Dum-cooked vegetable biryani with saffron and mint", veg: true, popular: true },
    { name: "Chicken Biryani", price: 399, desc: "Fragrant Lucknowi dum biryani with tender chicken", veg: false, popular: true },
    { name: "Mutton Biryani", price: 499, desc: "Slow-cooked mutton dum biryani with caramelised onions", veg: false, popular: true },
  ],
  "Breads": [
    { name: "Tandoori Roti (Plain)", price: 55, desc: "Whole wheat bread baked in clay oven", veg: true },
    { name: "Tandoori Roti (Butter)", price: 65, desc: "Whole wheat bread brushed with butter", veg: true },
    { name: "Tawa Roti (Plain)", price: 55, desc: "Soft griddle-cooked whole wheat bread", veg: true },
    { name: "Tawa Roti (Butter)", price: 65, desc: "Griddle roti finished with butter", veg: true },
    { name: "Plain Naan", price: 50, desc: "Classic leavened bread from the tandoor", veg: true },
    { name: "Lachha Paratha", price: 50, desc: "Flaky multi-layered whole wheat flatbread", veg: true, popular: true },
    { name: "Shirmal", price: 50, desc: "Soft, lightly sweet saffron-flavoured bread", veg: true },
    { name: "Naan (Butter/Garlic/Cheese)", price: 60, desc: "Leavened naan in butter, garlic or cheese variant", veg: true, popular: true },
    { name: "Kulcha (Aloo/Onion/Paneer)", price: 110, desc: "Stuffed leavened bread baked in tandoor", veg: true },
    { name: "Keema Kulcha", price: 160, desc: "Minced meat stuffed kulcha from the tandoor", veg: false },
  ],
  "Drinks": [
    { name: "Tea (Black/Green/Ginger)", price: 50, desc: "Your choice of classic Indian teas", veg: true },
    { name: "Coffee (Black/Regular)", price: 70, desc: "Freshly brewed hot coffee", veg: true },
    { name: "Apple Mojito", price: 160, desc: "Fresh apple juice with mint, lime and soda", veg: true, popular: true },
    { name: "Pacific Blue", price: 160, desc: "Blue curacao-style mocktail with citrus and soda", veg: true },
    { name: "Virgin Mojito", price: 160, desc: "Mint, lime, sugar syrup and crushed ice", veg: true, popular: true },
    { name: "Fresh Lime", price: 140, desc: "Sweet, salted or masala — your call", veg: true },
    { name: "Virgin Piñacolada", price: 170, desc: "Blended pineapple and coconut cream mocktail", veg: true },
    { name: "Mango Mintia", price: 170, desc: "Fresh mango with cooling mint and lime", veg: true },
    { name: "Chocolate Shake", price: 170, desc: "Rich chocolate blended with chilled milk", veg: true },
    { name: "Cold Coffee Milk", price: 170, desc: "Espresso blended with chilled milk and ice cream", veg: true, popular: true },
    { name: "Real Honey Lemonade", price: 180, desc: "Fresh lemon with pure honey and sparkling water", veg: true },
  ],
};

const MENU_TABS: { id: MenuCategory; label: string }[] = [
  { id: "Continental Starters", label: "Continental" },
  { id: "Oriental Starters", label: "Oriental" },
  { id: "Soups", label: "Soups" },
  { id: "Salads", label: "Salads" },
  { id: "Sandwiches", label: "Sandwiches" },
  { id: "Pasta", label: "Pasta" },
  { id: "Indian Mains", label: "Indian" },
  { id: "Oriental Mains", label: "Asian Mains" },
  { id: "Rice & Noodles", label: "Rice & Noodles" },
  { id: "Biryani", label: "Biryani" },
  { id: "Breads", label: "Breads" },
  { id: "Drinks", label: "Drinks" },
];

const GALLERY = [
  { src: "https://images.pexels.com/photos/1579926/pexels-photo-1579926.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Rooftop dining", wide: true },
  { src: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Signature food", wide: false },
  { src: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Restaurant ambience", wide: false },
  { src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Chef's dishes", wide: true },
  { src: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Skyline view", wide: false },
  { src: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Evening at Cilantrro", wide: false },
];

const TESTIMONIALS = [
  { name: "Digvijay Chaturvedi", role: "Local Guide · 134 reviews", text: "Cilantrro offers a fantastic dining experience — the rooftop ambiance is stunning. The non-vegetarian dishes are exceptional, from succulent kebabs to flavorful curries.", stars: 5, initial: "D" },
  { name: "Shivangi Singh", role: "Verified Guest", text: "Service is excellent, food is absolutely delicious! The flavours are incredible and the staff is so warm. Will definitely come back again and again!", stars: 5, initial: "S" },
  { name: "Simson Dukpa", role: "Verified Guest", text: "A very good place to visit with the whole family. Food is good in taste and the rooftop setting is magical in the evenings. Captain Sunil made us feel very welcome.", stars: 5, initial: "S" },
  { name: "Priya Mehta", role: "Zomato Gold Member", text: "The Thai curry here is absolutely on point. Loved the ambiance under the open sky — it's a must-visit for anyone in Lucknow.", stars: 5, initial: "P" },
  { name: "Rahul Awasthi", role: "Food Blogger", text: "From the dimsum to the biryani, every dish showed real craftsmanship. The rooftop setting with city lights in the background made it truly special.", stars: 5, initial: "R" },
  { name: "Ananya Srivastava", role: "Regular Guest", text: "Been here over a dozen times and it never disappoints. The Drums of Heaven and BBQ Chicken Wings are unmissable. The staff remembers my preferences!", stars: 5, initial: "A" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = {
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  MapPin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Message: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Bag: ({ size = 12 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Instagram: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Facebook: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  PhoneLg: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapLg: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Wa: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.087.536 4.05 1.475 5.756L0 24l6.38-1.458A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 0 1-5.004-1.371l-.357-.213-3.713.849.872-3.606-.234-.37A9.81 9.81 0 0 1 2.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>,
};

// ─── CANVAS PARTICLES ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 70;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.018;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,155,60,${alpha})`; ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200,155,60,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} id="particles-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} />;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          setVal(Math.floor(ease * target));
          if (t < 1) requestAnimationFrame(tick); else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
    el.style.boxShadow = `${-x * 16}px ${y * 16}px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,155,60,0.35)`;
  };
  const handleLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(600px) rotateY(0) rotateX(0) translateZ(0)";
    el.style.boxShadow = "";
    el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s";
    setTimeout(() => { if (el) el.style.transition = ""; }, 500);
  };
  return (
    <div ref={ref} className={className} style={{ ...style, transition: "transform 0.08s, box-shadow 0.08s" }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────
function MagBtn({ href, className, children, onClick }: { href: string; className: string; children: React.ReactNode; onClick?: (e: React.MouseEvent) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    el.style.transform = "translate(0,0)";
    setTimeout(() => { if (el) el.style.transition = ""; }, 500);
  };
  return (
    <a ref={ref} href={href} className={className} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.1s" }}>
      {children}
    </a>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MenuCategory>("Oriental Starters");
  const [menuSearch, setMenuSearch] = useState("");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "2", occasion: "", message: "" });
  const heroBgRef = useRef<HTMLDivElement>(null);

  useReveal();

  // Loader
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1900); return () => clearTimeout(t); }, []);

  // Custom cursor
  useEffect(() => {
    const dot = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;
    let rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
      rx += (e.clientX - rx) * 0.12; ry += (e.clientY - ry) * 0.12;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    };
    const raf = () => { requestAnimationFrame(raf); };
    let rafId = requestAnimationFrame(raf);
    const smoothRing = () => {
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    };
    const moveSm = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
      rx += (e.clientX - rx) * 0.1; ry += (e.clientY - ry) * 0.1;
      smoothRing();
    };
    const addHover = () => document.body.classList.add("cursor-hover");
    const removeHover = () => document.body.classList.remove("cursor-hover");
    window.addEventListener("mousemove", moveSm, { passive: true });
    document.querySelectorAll("a, button, .menu-card, .gallery-item, .event-card, .testimonial-card").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });
    cancelAnimationFrame(rafId);
    return () => { window.removeEventListener("mousemove", moveSm); };
  }, [loaded]);

  // Scroll effects
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setScrolled(y > 60);
      setProgress(total > 0 ? (y / total) * 100 : 0);
      // Parallax hero
      if (heroBgRef.current) heroBgRef.current.style.transform = `translateY(${y * 0.38}px)`;
      const sections = ["home","menu","about","gallery","testimonials","events","visit","contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop - 140) { setActiveNav(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard lightbox
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!lightbox.open) return;
      if (e.key === "Escape") setLightbox({ open: false, idx: 0 });
      if (e.key === "ArrowRight") setLightbox((l) => ({ ...l, idx: (l.idx + 1) % GALLERY.length }));
      if (e.key === "ArrowLeft") setLightbox((l) => ({ ...l, idx: (l.idx - 1 + GALLERY.length) % GALLERY.length }));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [lightbox.open]);

  // Body overflow for mobile menu
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; }, [mobileOpen]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const filtered = MENU[activeTab].filter((item) => {
    const q = menuSearch.toLowerCase();
    return item.name.toLowerCase().includes(q) &&
      (vegFilter === "all" || (vegFilter === "veg" ? item.veg : !item.veg));
  });

  const navLinks = ["home","menu","about","gallery","events","visit","contact"];

  return (
    <>
      {/* ── CUSTOM CURSOR ── */}
      <div id="cursor" />
      <div id="cursor-ring" />

      {/* ── LOADER ── */}
      <div id="loader" className={loaded ? "hidden" : ""}>
        <div className="loader-bg"><div className="loader-bg-line" /></div>
        <div className="loader-logo">Cilantrro</div>
        <div className="loader-tagline">Luxury Rooftop Dining · Lucknow</div>
        <div className="loader-bar"><div className="loader-fill" /></div>
        <div className="loader-dots"><div className="loader-dot"/><div className="loader-dot"/><div className="loader-dot"/></div>
      </div>

      {/* ── PROGRESS ── */}
      <div id="progress-bar" style={{ width: `${progress}%` }} />

      {/* ── GLOW ── */}
      <div className="ambient-glow" id="ambient-glow" />

      {/* ── NAV ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
          <span className="nav-logo-text">Cilantrro</span>
          <span className="nav-logo-sub">Rooftop</span>
        </a>
        <ul className="nav-links">
          {navLinks.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={activeNav === id ? "active" : ""} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                {id === "visit" ? "Visit Us" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="tel:07311159666" className="nav-phone"><Icon.Phone />073111 59666</a>
          <a href="https://www.zomato.com/lucknow/cilantrro-aashiana" target="_blank" rel="noreferrer" className="btn-zomato"><Icon.Bag />Zomato</a>
          <a href="https://www.swiggy.com/restaurants/cilantro-kingship-by-kahlon-vrindavan-colony-lucknow-634110/dineout" target="_blank" rel="noreferrer" className="btn-swiggy"><Icon.Bag />Swiggy</a>
          <a href="#contact" className="btn-reserve-nav" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}><Icon.Calendar />Reserve</a>
        </div>
        <button className={`hamburger${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {navLinks.map((id) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
            {id === "visit" ? "Visit Us" : id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
        <div className="mobile-menu-actions">
          <a href="https://www.zomato.com/lucknow/cilantrro-aashiana" target="_blank" rel="noreferrer" className="btn-zomato" onClick={() => setMobileOpen(false)}>Zomato</a>
          <a href="https://www.swiggy.com/restaurants/cilantro-kingship-by-kahlon-vrindavan-colony-lucknow-634110/dineout" target="_blank" rel="noreferrer" className="btn-swiggy" onClick={() => setMobileOpen(false)}>Swiggy</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", position: "relative" }}>
        <div ref={heroBgRef} className="hero-bg" />
        <ParticleCanvas />
        <div className="hero-content" style={{ position: "relative", zIndex: 2, maxWidth: 860, padding: "0 1.5rem" }}>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Luxury Rooftop Dining · Lucknow
            <span className="hero-eyebrow-dot" />
          </div>
          <h1 className="hero-h1 font-display">
            Dine Under
            <span className="hero-h1-sub">The Lucknow Sky</span>
          </h1>
          <p className="hero-sub">A curated multi-cuisine experience atop Hotel Kingship. Where every dish is crafted with intention and every evening becomes a memory.</p>
          <div className="hero-ctas">
            <MagBtn href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              <Icon.Calendar />Reserve a Table
            </MagBtn>
            <MagBtn href="#menu" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo("menu"); }}>
              Explore the Menu →
            </MagBtn>
          </div>
          <div className="hero-order">
            <span className="hero-order-label">Order Online:</span>
            <a href="https://www.zomato.com/lucknow/cilantrro-aashiana" target="_blank" rel="noreferrer" className="btn-zomato"><Icon.Bag />Zomato</a>
            <a href="https://www.swiggy.com/restaurants/cilantro-kingship-by-kahlon-vrindavan-colony-lucknow-634110/dineout" target="_blank" rel="noreferrer" className="btn-swiggy"><Icon.Bag />Swiggy</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><div className="stat-val">4.8★</div><div className="stat-label">Google Rating</div></div>
          <div className="stat-divider"/>
          <div className="stat-item"><div className="stat-val">1,596+</div><div className="stat-label">Reviews</div></div>
          <div className="stat-divider"/>
          <div className="stat-item"><div className="stat-val">149</div><div className="stat-label">Dishes</div></div>
          <div className="stat-divider"/>
          <div className="stat-item"><div className="stat-val">₹400–1,400</div><div className="stat-label">Per Person</div></div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-mouse"><div className="scroll-wheel"/></div>
          Scroll
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) =>
            ["Continental", "Oriental Dumplings", "Thai Curries", "Lucknowi Biryani", "Artisan Dim Sum", "Live Rooftop", "4.8★ on Google", "Private Events"].map((txt) => (
              <span className="marquee-item" key={`${i}-${txt}`}>
                {txt}<span className="marquee-diamond"/>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── MENU ── */}
      <section id="menu" style={{ background: "var(--bg2)" }}>
        <div className="section-wrap">
          <div className="reveal">
            <div className="section-eyebrow">Our Menu</div>
            <h2 className="section-title font-display">A World of Flavours</h2>
            <p className="section-sub">12 sections · 149 dishes — Continental, Oriental, Indian Mains, Thai, Biryani and more.</p>
            <div className="gold-divider"/>
          </div>
          <div className="menu-search-row reveal">
            <div className="menu-search-wrap">
              <span className="menu-search-icon"><Icon.Search /></span>
              <input className="menu-search" type="text" placeholder="Search any dish..." value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)} />
              {menuSearch && <button className="menu-clear" onClick={() => setMenuSearch("")}><Icon.X /></button>}
            </div>
            <div className="veg-filters">
              {(["all","veg","nonveg"] as const).map((f) => (
                <button key={f} className={`veg-btn ${f}${vegFilter === f ? " active" : ""}`} onClick={() => setVegFilter(f)}>
                  {f === "all" ? "All" : f === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                </button>
              ))}
            </div>
          </div>
          <div className="menu-tabs reveal">
            {MENU_TABS.map((tab) => (
              <button key={tab.id} className={`menu-tab${activeTab === tab.id ? " active" : ""}`} onClick={() => { setActiveTab(tab.id); setMenuSearch(""); }}>
                <span>{tab.label} <span style={{ opacity: 0.6, fontSize: "0.65rem" }}>({MENU[tab.id].length})</span></span>
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--fg-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🍽️</div>
              <p>No dishes found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="menu-grid">
              {filtered.map((item, i) => (
                <TiltCard key={item.name} className={`menu-card reveal reveal-delay-${Math.min((i % 4) + 1, 5)}`}>
                  <div className="menu-card-header">
                    <span className="menu-name">{item.name}</span>
                    <span className="menu-price">{item.price > 0 ? `₹${item.price}` : "MRP"}</span>
                  </div>
                  {item.desc && <p className="menu-desc">{item.desc}</p>}
                  <div className="menu-footer">
                    <div className="menu-badge">
                      <span className={item.veg ? "veg-dot" : "nveg-dot"}/>
                      <span style={{ color: "var(--fg-dim)", fontSize: "0.69rem" }}>{item.veg ? "Veg" : "Non-Veg"}</span>
                    </div>
                    {item.popular && <span className="popular-badge">⭐ Popular</span>}
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: "var(--bg)" }}>
        <div className="section-wrap">
          <div className="about-grid">
            <div className="about-img-wrap reveal-left">
              <img className="about-img" src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Cilantrro rooftop" />
              <div className="about-img-accent">
                <div className="about-accent-num">2019</div>
                <div className="about-accent-label">Est. in Lucknow</div>
              </div>
            </div>
            <div className="reveal-right">
              <div className="section-eyebrow">About Us</div>
              <h2 className="section-title font-display">Where the City Meets the Sky</h2>
              <div className="gold-divider"/>
              <p style={{ color: "var(--fg-muted)", lineHeight: 1.9, marginBottom: "1rem", fontSize: "0.95rem" }}>
                Perched atop Hotel Kingship by Kahlon, Cilantrro is Lucknow's finest rooftop dining destination — where Awadhi heritage meets global culinary craft under the open sky.
              </p>
              <p style={{ color: "var(--fg-muted)", lineHeight: 1.9, marginBottom: "1.8rem", fontSize: "0.95rem" }}>
                Our chefs draw from generations of Awadhi tradition while embracing modern technique — spanning the tandoor, the wok, artisan pasta and Thai curries, all under one rooftop.
              </p>
              <div className="counter-grid">
                {[
                  { target: 1596, suffix: "+", label: "Guest Reviews" },
                  { target: 149, suffix: "", label: "Dishes on Menu" },
                  { target: 5, suffix: "+", label: "Years of Excellence" },
                ].map(({ target, suffix, label }) => (
                  <div className="counter-card" key={label}>
                    <div className="counter-val"><Counter target={target} suffix={suffix} /></div>
                    <div className="counter-label">{label}</div>
                  </div>
                ))}
              </div>
              <div className="about-features">
                {[
                  { icon: "🌙", title: "Open Air Rooftop", desc: "Panoramic city views, starlit dining every evening" },
                  { icon: "🍽️", title: "12 Menu Sections", desc: "Continental, Oriental, Indian, Thai, Biryani & more" },
                  { icon: "🎉", title: "Private Events", desc: "Birthdays, corporate dinners, pre-weddings" },
                  { icon: "⭐", title: "4.8 on Google", desc: "1,596+ reviews — Lucknow's most loved rooftop" },
                ].map(({ icon, title, desc }) => (
                  <TiltCard key={title} className="about-feat">
                    <div className="about-feat-icon">{icon}</div>
                    <div className="about-feat-title">{title}</div>
                    <div className="about-feat-desc">{desc}</div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background: "var(--bg2)" }}>
        <div className="section-wrap">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 2.5rem" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>Gallery</div>
            <h2 className="section-title font-display">Taste with Your Eyes</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>A glimpse into the Cilantrro experience — the flavours, the ambience, the moments.</p>
          </div>
          <div className="gallery-grid reveal">
            {GALLERY.map((img, idx) => (
              <div key={idx} className={`gallery-item${img.wide ? " wide" : ""}`} onClick={() => setLightbox({ open: true, idx })}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-border-glow"/>
                <div className="gallery-overlay">
                  <div className="gallery-overlay-inner">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    <span>Expand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <div className={`lightbox${lightbox.open ? " open" : ""}`} onClick={() => setLightbox({ open: false, idx: 0 })}>
        <button className="lightbox-close"><Icon.X /></button>
        <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((l) => ({ ...l, idx: (l.idx - 1 + GALLERY.length) % GALLERY.length })); }}><Icon.ChevLeft /></button>
        <img className="lightbox-img" src={GALLERY[lightbox.idx]?.src} alt={GALLERY[lightbox.idx]?.alt} onClick={(e) => e.stopPropagation()} />
        <button className="lightbox-next lightbox-nav" onClick={(e) => { e.stopPropagation(); setLightbox((l) => ({ ...l, idx: (l.idx + 1) % GALLERY.length })); }}><Icon.ChevRight /></button>
        <div className="lightbox-counter">{lightbox.idx + 1} / {GALLERY.length}</div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: "var(--bg)" }}>
        <div className="section-wrap">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 3rem" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>Guest Reviews</div>
            <h2 className="section-title font-display">What Our Guests Say</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>4.8★ on Google · 1,596 reviews and counting</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <TiltCard key={t.name} className={`testimonial-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="testimonial-quote">"</div>
                <div className="testimonial-stars">{[...Array(t.stars)].map((_, j) => <span key={j} className="star">★</span>)}</div>
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-meta">{t.role}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: "2.2rem" }}>
            <a href="https://g.co/kgs/cilantrro" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: "inline-flex" }}>
              Read All 1,596 Reviews on Google ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" style={{ background: "var(--bg2)" }}>
        <div className="section-wrap">
          <div className="reveal">
            <div className="section-eyebrow">Private Events</div>
            <h2 className="section-title font-display">Your Celebration, Our Canvas</h2>
            <p className="section-sub">From intimate dinners to grand celebrations — Cilantrro's rooftop transforms into the perfect setting for every occasion.</p>
            <div className="gold-divider"/>
          </div>
          <div className="events-grid">
            {[
              { img: "https://images.pexels.com/photos/1729808/pexels-photo-1729808.jpeg?auto=compress&cs=tinysrgb&w=700", tag: "Birthday & Anniversaries", title: "Celebrate in Style", desc: "Customised décor, special menus, live music arrangements, and a sky full of stars — we turn birthdays and anniversaries into unforgettable evenings." },
              { img: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=700", tag: "Corporate Dinners", title: "Business Meets Luxury", desc: "Impress clients and reward teams with a curated corporate dining experience. Private terrace bookings available for groups up to 80 guests." },
              { img: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=700", tag: "Pre-Wedding & Receptions", title: "Love Under Open Skies", desc: "Rooftop cocktail evenings, pre-wedding dinners, and intimate receptions with Lucknow's city skyline as your backdrop." },
            ].map((ev, i) => (
              <TiltCard key={ev.tag} className={`event-card reveal reveal-delay-${i + 1}`}>
                <div className="event-img-wrap"><img className="event-img" src={ev.img} alt={ev.tag} loading="lazy"/></div>
                <div className="event-body">
                  <div className="event-tag">{ev.tag}</div>
                  <div className="event-title font-display">{ev.title}</div>
                  <p className="event-desc">{ev.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <MagBtn href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              <Icon.Message />Enquire for Your Event
            </MagBtn>
          </div>
        </div>
      </section>

      {/* ── VISIT ── */}
      <section id="visit" style={{ background: "var(--bg)" }}>
        <div className="section-wrap">
          <div className="reveal">
            <div className="section-eyebrow">Visit Us</div>
            <h2 className="section-title font-display">Find Us at the Top</h2>
            <p className="section-sub">We're open every day. Come for lunch, stay for the sunset, linger through dinner.</p>
            <div className="gold-divider"/>
          </div>
          <div className="visit-grid">
            <div className="reveal-left">
              {[
                { label: "📍 Address", val: "2nd Floor, Hotel Kingship By Kahlon\nNear Apex Trauma Center\nSector 16, Vrindavan Colony\nLucknow, UP – 226029" },
                { label: "🕐 Opening Hours", val: "Monday – Sunday\n11:00 AM – 11:00 PM" },
                { label: "📞 Reservations", val: "phone" },
                { label: "💰 Price Range", val: "₹400 – ₹1,400 per person" },
                { label: "🚗 Parking", val: "Complimentary valet parking at Hotel Kingship entrance" },
              ].map(({ label, val }) => (
                <div className="visit-info-block" key={label}>
                  <div className="visit-info-label">{label}</div>
                  {val === "phone" ?
                    <div className="visit-info-val"><a href="tel:07311159666" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>073111 59666</a></div> :
                    <div className="visit-info-val" style={{ whiteSpace: "pre-line" }}>{val}</div>
                  }
                </div>
              ))}
              <MagBtn href="https://maps.google.com/?q=Cilantrro+Hotel+Kingship+By+Kahlon+Vrindavan+Colony+Lucknow" className="btn-primary" style={{ display: "inline-flex", marginTop: "0.5rem" }}>
                <Icon.MapPin />Get Directions
              </MagBtn>
            </div>
            <div className="reveal-right">
              <div className="visit-map-wrap">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6!2d80.8893!3d26.7606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ1JzM4LjIiTiA4MMKwNTMnMjEuNSJF!5e0!3m2!1sen!2sin!4v1" loading="lazy" allowFullScreen title="Cilantrro Location"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: "var(--bg2)" }}>
        <div className="section-wrap">
          <div className="contact-grid">
            <div className="reveal-left">
              <div className="section-eyebrow">Reserve a Table</div>
              <h2 className="section-title font-display">Make a Reservation</h2>
              <p className="section-sub" style={{ marginBottom: "2rem" }}>Book your table for an unforgettable evening. We'll confirm within a few hours.</p>
              {formSubmitted ? (
                <div className="form-success">
                  <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>🎉</div>
                  <h3>Reservation Received!</h3>
                  <p>Thank you! We'll confirm your table via phone within a few hours. See you at Cilantrro.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}>
                  <div className="form-row">
                    <div className="form-group"><label>Your Name</label><input type="text" placeholder="Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
                    <div className="form-group">
                      <label>Guests</label>
                      <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                        {["1","2","3","4","5","6","7","8","9","10+"].map((n) => <option key={n}>{n} {n === "1" ? "Guest" : "Guests"}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Occasion (Optional)</label>
                    <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                      <option value="">Select occasion</option>
                      {["Birthday","Anniversary","Corporate Dinner","Date Night","Family Gathering","Pre-Wedding","Other"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Special Requests</label><textarea placeholder="Dietary restrictions, seating preferences, décor requests..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                  <button type="submit" className="btn-submit">Confirm Reservation</button>
                </form>
              )}
            </div>
            <div className="contact-info reveal-right">
              {[
                { icon: <Icon.PhoneLg />, title: "Call Us", val: <><a href="tel:07311159666">073111 59666</a><br /><span>Mon – Sun · 11 AM – 11 PM</span></> },
                { icon: <Icon.MapLg />, title: "Location", val: <>2nd Floor, Hotel Kingship By Kahlon<br />Vrindavan Colony, Lucknow – 226029</> },
                { icon: <Icon.Clock />, title: "Hours", val: <>Mon – Sun: 11:00 AM – 11:00 PM<br />Open all days including holidays</> },
              ].map(({ icon, title, val }) => (
                <div key={title} className="contact-info-item">
                  <div className="contact-icon">{icon}</div>
                  <div>
                    <div className="contact-info-title">{title}</div>
                    <div className="contact-info-val">{val}</div>
                  </div>
                </div>
              ))}
              <div>
                <div style={{ marginBottom: "0.8rem" }}>
                  <div className="contact-info-title" style={{ marginBottom: "0.6rem" }}>Follow Us</div>
                  <div className="social-links">
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link"><Icon.Instagram /></a>
                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link"><Icon.Facebook /></a>
                  </div>
                </div>
                <div className="wa-quick">
                  <div className="wa-quick-label">Quick Reservation</div>
                  <a href="https://wa.me/917311159666?text=Hi!%20I%20would%20like%20to%20make%20a%20reservation%20at%20Cilantrro." target="_blank" rel="noreferrer" className="wa-link">
                    <Icon.Wa />WhatsApp Reservation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo" style={{ background: "linear-gradient(135deg, var(--fg), var(--gold-light), var(--fg))", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerText 5s linear infinite" }}>Cilantrro</div>
        <div className="footer-tagline">The Roof Top Restaurant · Vrindavan Colony, Lucknow</div>
        <div className="footer-social">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link"><Icon.Instagram /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link"><Icon.Facebook /></a>
        </div>
        <div className="footer-links">
          {navLinks.map((id) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
              {id === "visit" ? "Visit Us" : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Cilantrro — Hotel Kingship By Kahlon, Vrindavan Colony, Lucknow, UP 226029<br />
          <span>
            Order on{" "}<a href="https://www.zomato.com/lucknow/cilantrro-aashiana" target="_blank" rel="noreferrer" style={{ color: "#E23744", textDecoration: "none" }}>Zomato</a>
            {" "}·{" "}<a href="https://www.swiggy.com/restaurants/cilantro-kingship-by-kahlon-vrindavan-colony-lucknow-634110/dineout" target="_blank" rel="noreferrer" style={{ color: "#FC8019", textDecoration: "none" }}>Swiggy</a>
            {" "}· cilantrro.com
          </span>
        </p>
      </footer>

      {/* ── WHATSAPP ── */}
      <a href="https://wa.me/917311159666?text=Hi!%20I%20would%20like%20to%20make%20a%20reservation%20at%20Cilantrro." target="_blank" rel="noreferrer" className="whatsapp-btn">
        <Icon.Wa />
        <span className="whatsapp-tooltip">Reserve via WhatsApp</span>
      </a>
    </>
  );
}
