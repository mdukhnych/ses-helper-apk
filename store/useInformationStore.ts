import { Information, InstructionsItem } from '@/types/information';
import { create } from 'zustand';

type InformationStore = {
  information: Information | null;
  instructionsDataStore: InstructionsItem[];
  setInfromationStore: (data: Information) => void;
  setInstructionsDataStore: (data: InstructionsItem[]) => void;
}

export const useInformationStore = create<InformationStore>((set) => ({
  information: null,
  instructionsDataStore: [],
  setInfromationStore: (data) => set({information: data}),
  setInstructionsDataStore: (data) => set({instructionsDataStore: data}),
}));