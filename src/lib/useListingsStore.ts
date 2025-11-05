import { create } from "zustand";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  rating: string;
  item_sold: string;
  item_listed: string;
  profilePic?: string;
}

interface Listing {
  id: number;
  name: string;
  category: string;
  price: string;
  postedBy: {
    name: string;          // seller full name
    profilePic?: string;    // optional avatar
  };
  images: string[];
  condition?: string;
  description?: string;  // ← add this
  isbn?: string; 
  postedAt?: string;
  liked?: boolean;
}

interface Store {
  user: User;
  setUser: (u: User) => void;

  items: Listing[];
  setItems: (items: Listing[]) => void;
  toggleLike: (id: number) => void;
  removeListing: (id: number) => void;

  cart: Listing[];
  addToCart: (item: Listing) => void;
  removeFromCart: (id: number) => void;
  toggleCart: (item: Listing) => void;
  addListing: (item: Listing) => void;

}

export const useListingStore = create<Store>((set) => ({
  // ✅ User info
  user: {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    rating: "1.5",
    item_sold: "3",
    item_listed: "2",
    profilePic: "",
  },
  setUser: (user) => set({ user }),

  // ✅ Items
  items: [],
  setItems: (items) => set({ items }),
  toggleLike: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      ),
    })),
  removeListing: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  addListing: (item: Listing) =>
  set((state) => ({ items: [...state.items, item] })),

  // ✅ Cart
  cart: [],
  addToCart: (item) =>
    set((state) =>
      state.cart.find((i) => i.id === item.id)
        ? state
        : { cart: [...state.cart, item] }
    ),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  toggleCart: (item) =>
    set((state) =>
      state.cart.find((i) => i.id === item.id)
        ? { cart: state.cart.filter((i) => i.id !== item.id) }
        : { cart: [...state.cart, item] }
    ),
}));
