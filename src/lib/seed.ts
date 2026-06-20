import { db } from './firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { PRODUCTS, CATEGORIES } from '../constants';

export const seedDatabase = async () => {
  console.log("Starting Firebase seeding...");

  try {
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

    await batch.commit();

    console.log("Database seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error };
  }
};
