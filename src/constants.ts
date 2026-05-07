import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400', icon: 'LeafyGreen' },
  { id: '2', name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adb3ef26402b?auto=format&fit=crop&q=80&w=400', icon: 'Apple' },
  { id: '3', name: 'Daily Essentials', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400', icon: 'Container' },
  { id: '4', name: 'Snacks', image: 'https://images.unsplash.com/photo-1599490659223-930b447870ed?auto=format&fit=crop&q=80&w=400', icon: 'Cookie' },
  { id: '5', name: 'Beverages', image: 'https://images.unsplash.com/photo-1625772290748-39126ddd9f61?auto=format&fit=crop&q=80&w=400', icon: 'GlassWater' },
  { id: '6', name: 'Bakery', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=400', icon: 'Croissant' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Organic Tomatoes',
    category: 'Vegetables',
    price: 49,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Farm-fresh organic tomatoes, picked at peak ripeness. Perfect for salads, sauces, and sandwiches. Rich in Vitamin C and antioxidants.',
    rating: 4.8,
    reviewsCount: 124,
    isTrending: true,
    unit: '1 kg',
  },
  {
    id: 'p2',
    name: 'Premium Alphanso Mangoes',
    category: 'Fruits',
    price: 599,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'The king of fruits! Sweet, juicy, and legendary Alphanso mangoes from the finest orchards. Naturally ripened.',
    rating: 4.9,
    reviewsCount: 89,
    isTrending: true,
    unit: '1 dozen',
  },
  {
    id: 'p3',
    name: 'Organic Broccoli',
    category: 'Vegetables',
    price: 89,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Fresh green organic broccoli. High in fiber and protein, perfect for steaming or stir-frying.',
    rating: 4.7,
    reviewsCount: 56,
    isOffer: true,
    unit: '500 g',
  },
  {
    id: 'p4',
    name: 'Crunchy Chocolate Granola',
    category: 'Snacks',
    price: 249,
    image: 'https://images.unsplash.com/photo-1517093297699-14375bc162e7?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1517093297699-14375bc162e7?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Oats, nuts, and chocolate chips roasted to perfection for a healthy and tasty breakfast snack.',
    rating: 4.5,
    reviewsCount: 230,
    unit: '400 g',
  },
  {
    id: 'p5',
    name: 'Pure Himalayan Honey',
    category: 'Daily Essentials',
    price: 349,
    originalPrice: 400,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500'
    ],
    description: '100% pure and natural honey sourced from the high-altitude Himalayan ranges. No added sugar.',
    rating: 4.8,
    reviewsCount: 112,
    isTrending: true,
    unit: '500 g',
  },
  {
    id: 'p6',
    name: 'Freshly Baked Baguette',
    category: 'Bakery',
    price: 75,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Crusty on the outside, soft on the inside. Baked fresh daily with premium flour.',
    rating: 4.6,
    reviewsCount: 78,
    unit: '1 pc',
  },
  {
    id: 'p7',
    name: 'Avocado Hass (Pack of 2)',
    category: 'Fruits',
    price: 399,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Creamy Hass avocados, imported and perfectly ripe. Great for guacamole or toast.',
    rating: 4.8,
    reviewsCount: 45,
    isTrending: true,
    unit: '2 pcs',
  },
  {
    id: 'p8',
    name: 'Sparkling Apple Juice',
    category: 'Beverages',
    price: 120,
    image: 'https://images.unsplash.com/photo-1600271886332-699bb27c91fc?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1600271886332-699bb27c91fc?auto=format&fit=crop&q=80&w=500'
    ],
    description: 'Refreshing sparkling juice made from 100% natural apples. No preservatives.',
    rating: 4.4,
    reviewsCount: 67,
    unit: '330 ml',
  },
];
