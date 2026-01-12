import { create } from 'zustand';
import { Business } from '@businesshub/shared';

interface BusinessState {
  businesses: Business[];
  selectedBusinessId: string | null;
  setBusinesses: (businesses: Business[]) => void;
  selectBusiness: (businessId: string | null) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (business: Business) => void;
  removeBusiness: (businessId: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesses: [],
  selectedBusinessId: null,

  setBusinesses: (businesses) => set({ businesses }),

  selectBusiness: (businessId) => set({ selectedBusinessId: businessId }),

  addBusiness: (business) =>
    set((state) => ({ businesses: [...state.businesses, business] })),

  updateBusiness: (business) =>
    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === business.id ? business : b
      ),
    })),

  removeBusiness: (businessId) =>
    set((state) => ({
      businesses: state.businesses.filter((b) => b.id !== businessId),
      selectedBusinessId:
        state.selectedBusinessId === businessId ? null : state.selectedBusinessId,
    })),
}));
