export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  isTrending?: boolean;
  isOffer?: boolean;
  isSummerSpecial?: boolean;
  unit: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  items: OrderItem[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  address?: string;
  phoneNumber?: string;
  createdAt: string;
}
