import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInputState, DashboardSettingsState } from './schemas';

interface AppState {
  userInputs: UserInputState;
  settings: DashboardSettingsState;
  
  // Actions
  updateUserInputs: (inputs: Partial<UserInputState>) => void;
  updateSettings: (settings: Partial<DashboardSettingsState>) => void;
  addBorrowerDebt: (debt: { name: string; amount: number }) => void;
  updateBorrowerDebt: (index: number, debt: { name: string; amount: number }) => void;
  removeBorrowerDebt: (index: number) => void;
  addCoBorrowerDebt: (debt: { name: string; amount: number }) => void;
  updateCoBorrowerDebt: (index: number, debt: { name: string; amount: number }) => void;
  removeCoBorrowerDebt: (index: number) => void;
  resetToDefaults: () => void;
}

const defaultUserInputs: UserInputState = {
  downPaymentPercent: 20,      // 20% (display value)
  interestRate: 6.5,           // 6.5% (display value)
  mortgageTermYears: 30,
  propertyTaxRate: 120,        // 1.2% in bps
  insuranceRate: 42,           // 0.42% in bps
  mortgageInsuranceType: 'Conv - Good Credit',
  yearlyHOA: 0,
  incomeTaxRate: 25,           // 25% (display value)
  yearlyGrossIncome: 100000,
  borrowerDebts: [],
  coBorrowerIncome: 0,
  coBorrowerDebts: [],
};

const defaultSettings: DashboardSettingsState = {
  selectedRiskTier: 'Moderate',
  estimatedSqFt: 2000,
  utilityLevel: 'Moderate',
  maintenanceLevel: 'Moderate',
  closingCostOption: '2.5% of Price (Typical)',
  customPrice: 0, // 0 means not set
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userInputs: defaultUserInputs,
      settings: defaultSettings,

      updateUserInputs: (inputs) =>
        set((state) => ({
          userInputs: { ...state.userInputs, ...inputs },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      addBorrowerDebt: (debt) =>
        set((state) => ({
          userInputs: {
            ...state.userInputs,
            borrowerDebts: [...state.userInputs.borrowerDebts, debt],
          },
        })),

      updateBorrowerDebt: (index, debt) =>
        set((state) => {
          const newDebts = [...state.userInputs.borrowerDebts];
          newDebts[index] = debt;
          return {
            userInputs: { ...state.userInputs, borrowerDebts: newDebts },
          };
        }),

      removeBorrowerDebt: (index) =>
        set((state) => {
          const newDebts = [...state.userInputs.borrowerDebts];
          newDebts.splice(index, 1);
          return {
            userInputs: { ...state.userInputs, borrowerDebts: newDebts },
          };
        }),

      addCoBorrowerDebt: (debt) =>
        set((state) => ({
          userInputs: {
            ...state.userInputs,
            coBorrowerDebts: [...state.userInputs.coBorrowerDebts, debt],
          },
        })),

      updateCoBorrowerDebt: (index, debt) =>
        set((state) => {
          const newDebts = [...state.userInputs.coBorrowerDebts];
          newDebts[index] = debt;
          return {
            userInputs: { ...state.userInputs, coBorrowerDebts: newDebts },
          };
        }),

      removeCoBorrowerDebt: (index) =>
        set((state) => {
          const newDebts = [...state.userInputs.coBorrowerDebts];
          newDebts.splice(index, 1);
          return {
            userInputs: { ...state.userInputs, coBorrowerDebts: newDebts },
          };
        }),

      resetToDefaults: () =>
        set({
          userInputs: defaultUserInputs,
          settings: defaultSettings,
        }),
    }),
    {
      name: 'mortgage-calculator-storage',
    }
  )
);
