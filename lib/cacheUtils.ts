import * as FileSystem from 'expo-file-system';
import { Category, ProductSmall } from './types';

// File paths
const CATEGORIES_FILE_URI = `${FileSystem.documentDirectory}categories.json`;

// Save categories to local file system with timestamp
export const saveCategoriesToCache = async (categories: Category[]) => {
    const fileInfo = await FileSystem.getInfoAsync(CATEGORIES_FILE_URI);
    if (fileInfo.exists){
        await FileSystem.deleteAsync(CATEGORIES_FILE_URI)
    }
  const data = {
    timestamp: new Date().getTime(),
    categories,
  };
  await FileSystem.writeAsStringAsync(CATEGORIES_FILE_URI, JSON.stringify(data));
};

// Load categories from local file system if valid, otherwise fetch from API
export const loadCategoriesFromCache = async (): Promise<Category[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(CATEGORIES_FILE_URI);
    if (!fileInfo.exists) {
      return [];
    }

    const fileContent = await FileSystem.readAsStringAsync(CATEGORIES_FILE_URI);
    const data = JSON.parse(fileContent);

    // Check if data is older than 2 days (172800000 ms)
    if (new Date().getTime() - data.timestamp < 172800000) {
       
      return data.categories;
    } else {
      // Data is outdated
      await FileSystem.deleteAsync(CATEGORIES_FILE_URI)
      return [];
    }
  } catch (error) {
    console.error('Failed to load categories from cache', error);
    return [];
  }
};

// Save products of a category to local file system with timestamp
export const saveProductsToCache = async (products: ProductSmall[], categoryId: string) => {
    const PRODUCT_FILE_URI = `${FileSystem.documentDirectory}_cat_${categoryId}_product.json`;
    const fileInfo = await FileSystem.getInfoAsync(PRODUCT_FILE_URI);
    if (fileInfo.exists){
        await FileSystem.deleteAsync(PRODUCT_FILE_URI)
    }
  const data = {
    timestamp: new Date().getTime(),
    products,
  };
  await FileSystem.writeAsStringAsync(PRODUCT_FILE_URI, JSON.stringify(data));
};

// Load categories from local file system if valid, otherwise fetch from API
export const loadProductsFromCache = async (categoryId: string): Promise<ProductSmall[]> => {
    const PRODUCT_FILE_URI = `${FileSystem.documentDirectory}_cat_${categoryId}_product.json`;
    try {
    const fileInfo = await FileSystem.getInfoAsync(PRODUCT_FILE_URI);
    if (!fileInfo.exists) {
      return [];
    }

    const fileContent = await FileSystem.readAsStringAsync(PRODUCT_FILE_URI);
    const data = JSON.parse(fileContent);

    // Check if data is older than 2 days (172800000 ms)
    if (new Date().getTime() - data.timestamp < 172800000) {
       
      return data.products;
    } else {
      // Data is outdated
      await FileSystem.deleteAsync(PRODUCT_FILE_URI)
      return [];
    }
  } catch (error) {
    console.error('Failed to load categories from cache', error);
    return [];
  }
};
