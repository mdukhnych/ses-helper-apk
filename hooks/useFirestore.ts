import { useServicesStore } from "@/store/useServicesStore";
import { useCallback, useState } from "react";
import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "@/firebaseConfig";

import {
  EasyProData,
  EktaServicesDataItem,
  PhoneServicesData,
  Services,
  WarrantyDataItem,
} from "@/types/services";

import {
  Instructions,
  Motivations,
  Promos,
} from "@/types/information";

import {
  InformationCollectionKey,
  DocumentsDataStore,
  useInformationStore,
} from "@/store/useInformationStore";

const mapDocsWithId = <T>(querySnapshot: QuerySnapshot<DocumentData>) => {
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T;
};

const mapDocsData = <T>(querySnapshot: QuerySnapshot<DocumentData>) => {
  return querySnapshot.docs.map(doc => doc.data()) as T;
};

export default function useFirestore() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setServicesStore,
    setWarrantiesDataStore,
    setEasyProDataStore,
    setPhoneServicesStore,
    setEktaServicesStore,
  } = useServicesStore(state => state);

  const {
    setInformationStore,
    setDocumentsDataStore,
  } = useInformationStore();

  const withLoading = useCallback(async (callback: () => Promise<void>) => {
    setIsLoading(true);

    try {
      await callback();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchServices = useCallback(() => {
    return withLoading(async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "services")
      );

      setServicesStore(mapDocsWithId<Services>(querySnapshot));
    });
  }, [withLoading, setServicesStore]);

  const fetchWarranties = useCallback(() => {
    return withLoading(async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "services", "warranty-protection", "data")
      );

      setWarrantiesDataStore(
        mapDocsWithId<WarrantyDataItem[]>(querySnapshot)
      );
    });
  }, [withLoading, setWarrantiesDataStore]);

  const fetchEasyPro = useCallback(() => {
    return withLoading(async () => {
      const [pricelistSnapshot, descriptionSnapshot] = await Promise.all([
        getDocs(collection(FIREBASE_FIRESTORE, "services", "easy-pro", "pricelist")),
        getDocs(collection(FIREBASE_FIRESTORE, "services", "easy-pro", "description")),
      ]);

      setEasyProDataStore({
        pricelist: mapDocsData<EasyProData["pricelist"]>(pricelistSnapshot),
        description: mapDocsWithId<EasyProData["description"]>(descriptionSnapshot),
      });
    });
  }, [withLoading, setEasyProDataStore]);

  const fetchPhoneServices = useCallback(() => {
    return withLoading(async () => {
      const [goodsAndServicesSnapshot, servicesItemsSnapshot] = await Promise.all([
        getDocs(collection(FIREBASE_FIRESTORE, "services", "phone-services", "goodsAndServices")),
        getDocs(collection(FIREBASE_FIRESTORE, "services", "phone-services", "servicesItems")),
      ]);

      setPhoneServicesStore({
        goodsAndServices: mapDocsData<PhoneServicesData["goodsAndServices"]>(
          goodsAndServicesSnapshot
        ),
        servicesItems: mapDocsWithId<PhoneServicesData["servicesItems"]>(
          servicesItemsSnapshot
        ),
      });
    });
  }, [withLoading, setPhoneServicesStore]);

  const fetchEktaServicesData = useCallback(() => {
    return withLoading(async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "services", "ekta-services", "data")
      );

      setEktaServicesStore(
        mapDocsWithId<EktaServicesDataItem[]>(querySnapshot)
      );
    });
  }, [withLoading, setEktaServicesStore]);

  const fetchInformation = useCallback(() => {
    return withLoading(async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "information")
      );

      const data = Object.fromEntries(
        querySnapshot.docs.map(doc => [doc.id, doc.data()])
      );

      setInformationStore({
        instructions: data.instructions as Instructions,
        motivations: data.motivations as Motivations,
        promos: data.promos as Promos,
      });
    });
  }, [withLoading, setInformationStore]);

  const fetchInformationsData = useCallback(
    <K extends InformationCollectionKey>(docName: K) => {
      return withLoading(async () => {
        const querySnapshot = await getDocs(
          collection(FIREBASE_FIRESTORE, "information", docName, "items")
        );

        const data = mapDocsWithId<DocumentsDataStore[K]>(querySnapshot);

        setDocumentsDataStore(docName, data);
      });
    },
    [withLoading, setDocumentsDataStore]
  );

  return {
    isLoading,
    fetchServices,
    fetchWarranties,
    fetchEasyPro,
    fetchPhoneServices,
    fetchEktaServicesData,
    fetchInformation,
    fetchInformationsData,
  };
}