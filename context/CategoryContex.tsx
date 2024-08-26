import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the category data
interface Category {
  id: string | null;
  name: string;
  description: string;
  image: string;
}

// Define the shape of the context
interface CategoryContextType {
  category: Category;
  updateCategory: (newCategory: Category) => void;
}

// Create the context with a default value
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider component props type
interface CategoryProviderProps {
  children: ReactNode;
}

// Provider component
export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [category, setCategory] = useState<Category>({
    id: null,
    name: "",
    description: "",
    image: "",
  });

  const updateCategory = (newCategory: Category) => setCategory(newCategory);

  return (
    <CategoryContext.Provider value={{ category, updateCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook to use context
export const useCategory = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
