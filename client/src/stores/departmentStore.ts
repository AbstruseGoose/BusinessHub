import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Department {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  managerId?: string;
}

interface DepartmentStore {
  departments: Department[];
  selectedDepartmentId: string | null;
  setDepartments: (departments: Department[]) => void;
  selectDepartment: (departmentId: string) => void;
  clearDepartments: () => void;
}

export const useDepartmentStore = create<DepartmentStore>()(
  persist(
    (set) => ({
      departments: [],
      selectedDepartmentId: null,
      setDepartments: (departments) => set({ departments }),
      selectDepartment: (departmentId) => set({ selectedDepartmentId: departmentId }),
      clearDepartments: () => set({ departments: [], selectedDepartmentId: null }),
    }),
    {
      name: 'department-storage',
    }
  )
);
