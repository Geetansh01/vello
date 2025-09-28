// Dummy data for when API is not available
export const dummyProducts = [
  {
    product_id: "dummy_001",
    slug: "paracetamol-500mg-dummy",
    name: "Paracetamol 500mg Tablets",
    company: "Cipla",
    disease_category: "Fever & Pain",
    mrp: 30.00,
    discount: 15,
    discounted_price: 25.50,
    images: ["https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: true,
    available_stock: 150,
    description: "Effective relief from fever and mild to moderate pain. Suitable for headaches, muscle aches, and toothaches."
  },
  {
    product_id: "dummy_002",
    slug: "cetirizine-10mg-dummy",
    name: "Cetirizine 10mg Anti-Allergy",
    company: "Dr. Reddy's",
    disease_category: "Allergy & Cold",
    mrp: 55.00,
    discount: 10,
    discounted_price: 49.50,
    images: ["https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: true,
    available_stock: 200,
    description: "Provides 24-hour relief from allergy symptoms such as sneezing, runny nose, and itchy, watery eyes."
  },
  {
    product_id: "dummy_003",
    slug: "vitamin-c-chewable-dummy",
    name: "Vitamin C Chewable Tablets",
    company: "Abbott",
    disease_category: "Vitamins & Supplements",
    mrp: 150.00,
    discount: 18,
    discounted_price: 123.00,
    images: ["https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: true,
    available_stock: 250,
    description: "Boosts immunity and provides antioxidant support. Delicious orange flavor."
  },
  {
    product_id: "dummy_004",
    slug: "omeprazole-20mg-dummy",
    name: "Omeprazole 20mg Acidity Relief",
    company: "Zydus Cadila",
    disease_category: "Digestive Health",
    mrp: 95.00,
    discount: 5,
    discounted_price: 90.25,
    images: ["https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: false,
    available_stock: 120,
    description: "A proton pump inhibitor (PPI) that reduces the amount of acid produced in the stomach. For heartburn and acid reflux."
  },
  {
    product_id: "dummy_005",
    slug: "multivitamin-daily-dummy",
    name: "Multivitamin Daily Tablets",
    company: "Himalaya",
    disease_category: "Vitamins & Supplements",
    mrp: 250.00,
    discount: 25,
    discounted_price: 187.50,
    images: ["https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: true,
    available_stock: 300,
    description: "A comprehensive blend of essential vitamins and minerals to support overall health and wellness."
  },
  {
    product_id: "dummy_006",
    slug: "ibuprofen-400mg-dummy",
    name: "Ibuprofen 400mg",
    company: "Mankind Pharma",
    disease_category: "Fever & Pain",
    mrp: 45.00,
    discount: 12,
    discounted_price: 39.60,
    images: ["https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: false,
    available_stock: 180,
    description: "A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation."
  },
  {
    product_id: "dummy_007",
    slug: "cough-syrup-herbal-dummy",
    name: "Herbal Cough Syrup",
    company: "Dabur",
    disease_category: "Allergy & Cold",
    mrp: 85.00,
    discount: 5,
    discounted_price: 80.75,
    images: ["https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: false,
    available_stock: 110,
    description: "A soothing herbal formula for effective relief from cough and throat irritation without drowsiness."
  },
  {
    product_id: "dummy_008",
    slug: "calcium-vitamin-d3-dummy",
    name: "Calcium + Vitamin D3 Tablets",
    company: "Sun Pharma",
    disease_category: "Vitamins & Supplements",
    mrp: 220.00,
    discount: 20,
    discounted_price: 176.00,
    images: ["https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
    trending: true,
    available_stock: 0,
    description: "Supports bone health and strength with a combination of Calcium and Vitamin D3 for better absorption."
  }
];

export const dummyFeaturedProducts = dummyProducts.filter(p => p.trending).slice(0, 8);
export const dummyTrendingProducts = dummyProducts.filter(p => p.trending);