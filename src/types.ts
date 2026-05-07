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
  isTrending?: boolean;
  isOffer?: boolean;
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
