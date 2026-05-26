import { Information, InstructionsItem, MotivationsItem, PromoItem } from '@/types/information';
import { create } from 'zustand';

export type InformationCollectionKey = 'instructions' | 'motivations' | 'promos';

export type DocumentsDataStore = {
  instructions: InstructionsItem[];
  motivations: MotivationsItem[];
  promos: PromoItem[];
};

type InformationStore = {
  information: Information | null;
  documentsDataStore: DocumentsDataStore;

  setInformationStore: (data: Information) => void;

  setDocumentsDataStore: <K extends InformationCollectionKey>(
    collectionKey: K,
    data: DocumentsDataStore[K]
  ) => void;
};

const initialDocumentsDataStore: DocumentsDataStore = {
  instructions: [],
  motivations: [],
  promos: [],
};

export const useInformationStore = create<InformationStore>((set) => ({
  information: null,
  documentsDataStore: initialDocumentsDataStore,

  setInformationStore: (data) => set({ information: data }),

  setDocumentsDataStore: (collectionKey, data) =>
    set((state) => ({
      documentsDataStore: {
        ...state.documentsDataStore,
        [collectionKey]: data,
      },
    })),
  
}));