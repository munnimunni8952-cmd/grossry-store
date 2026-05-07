import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { PRODUCTS, CATEGORIES } from '../constants';

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // Seed Categories
  CATEGORIES.forEach((category) => {
    const categoryRef = doc(db, 'categories', category.id);
    batch.set(categoryRef, category);
  });

  // Seed Products
  PRODUCTS.forEach((product) => {
    const productRef = doc(db, 'products', product.id);
    batch.set(productRef, product);
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
