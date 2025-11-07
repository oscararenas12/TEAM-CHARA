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
  id: string; // Changed to string (UUID from Supabase)
  name: string;
  category: string;
  price: string;
  postedBy: {
    id: string;
    name: string;
    profilePic?: string;
  };
  images: string[];
  condition?: string;
  description?: string;
  isbn?: string;
  postedAt?: string;
  liked?: boolean;
}

interface Store {
  user: User;
  setUser: (u: User) => void;

  items: Listing[];
  setItems: (items: Listing[]) => void;
  toggleLike: (id: string) => void;
  removeListing: (id: string) => void;
  addListing: (item: Listing) => void;

  cart: Listing[];
  addToCart: (item: Listing) => void;
  removeFromCart: (id: string) => void;
  toggleCart: (item: Listing) => void;
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
  addListing: (item: Listing) =>
    set((state) => ({ items: [...state.items, item] })),
  removeListing: (id: string) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  // ❤️ Like = Add/Remove from cart
  toggleLike: (id: string) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      );

      const likedItem = updatedItems.find((i) => i.id === id);

      let updatedCart = state.cart;

      if (likedItem?.liked) {
        // Add to cart when liked
        if (!state.cart.find((i) => i.id === id)) {
          updatedCart = [...state.cart, likedItem];
        }
      } else {
        // Remove from cart when unliked
        updatedCart = state.cart.filter((i) => i.id !== id);
      }

      return { items: updatedItems, cart: updatedCart };
    }),

  // ✅ Cart
  cart: [],
  addToCart: (item: Listing) =>
    set((state) =>
      state.cart.find((i) => i.id === item.id)
        ? state
        : { cart: [...state.cart, item] }
    ),
  removeFromCart: (id: string) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  toggleCart: (item: Listing) =>
    set((state) =>
      state.cart.find((i) => i.id === item.id)
        ? { cart: state.cart.filter((i) => i.id !== item.id) }
        : { cart: [...state.cart, item] }
    ),
}));
