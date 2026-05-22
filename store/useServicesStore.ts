import { EasyProData, EktaServicesDataItem, PhoneServicesData, Services, WarrantyDataItem, WarrantyService } from '@/types/services';
import { create } from 'zustand';

type ServicesStore = {
  services: Services | null;
  warrantiesDataStore: WarrantyDataItem[];
  easyproDataStore: EasyProData;
  phoneServicesStore: PhoneServicesData;
  ektaServicesStore: EktaServicesDataItem[];
  setServicesStore: (newServices: Services) => void
  setWarrantiesDataStore: (data: WarrantyDataItem[]) => void;
  setEasyProDataStore: (data: EasyProData) => void;
  setPhoneServicesStore: (data: PhoneServicesData) => void;
  setEktaServicesStore: (data: EktaServicesDataItem[]) => void;
}

export const useServicesStore = create<ServicesStore>((set) => ({
  services: null,
  warrantiesDataStore: [],
  easyproDataStore: {
    description: [],
    pricelist: []
  },
  phoneServicesStore: {
    goodsAndServices: [],
    servicesItems: []
  },
  ektaServicesStore: [],
  setServicesStore: (newServices) => set({ services: newServices }),
  setWarrantiesDataStore: (data) => set({warrantiesDataStore: data}),
  setEasyProDataStore: (data) => set({easyproDataStore: data}),
  setPhoneServicesStore: (data) => set({phoneServicesStore: data}),
  setEktaServicesStore: (data) => set({ektaServicesStore: data}),
}));