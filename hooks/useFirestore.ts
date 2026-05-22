import { useServicesStore } from "@/store/useServicesStore";
import { useCallback, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "@/firebaseConfig";
import { EasyProData, EktaServicesDataItem, PhoneServicesData, Services, WarrantyDataItem } from "@/types/services";

export default function useFirestore() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setServicesStore, 
    setWarrantiesDataStore, 
    setEasyProDataStore, 
    setPhoneServicesStore,
    setEktaServicesStore
  } = useServicesStore(state => state);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "services"));
      setServicesStore(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Services
      );      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWarranties = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "services", "warranty-protection", "data"));
      setWarrantiesDataStore(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WarrantyDataItem[]
      );
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEasyPro = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pricelistSnapshot, descriptionSnapshot] = await Promise.all([
        getDocs(collection(FIREBASE_FIRESTORE, "services", "easy-pro", "pricelist")),
        getDocs(collection(FIREBASE_FIRESTORE, "services", "easy-pro", "description"))
      ]);

      setEasyProDataStore({
        pricelist: pricelistSnapshot.docs.map(doc => doc.data()),
        description: descriptionSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
      } as EasyProData);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPhoneServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const [goodsAndServicesSnapshot, servicesItemsSnapshot] = await Promise.all([
        getDocs(collection(FIREBASE_FIRESTORE, "services", "phone-services", "goodsAndServices")),
        getDocs(collection(FIREBASE_FIRESTORE, "services", "phone-services", "servicesItems"))
      ]);

      setPhoneServicesStore({
        goodsAndServices: goodsAndServicesSnapshot.docs.map(doc => doc.data()),
        servicesItems: servicesItemsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
      } as PhoneServicesData);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEktaServicesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "services", "ekta-services", "data"));
      setEktaServicesStore(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EktaServicesDataItem[]);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    fetchServices,
    fetchWarranties,
    fetchEasyPro,
    fetchPhoneServices,
    fetchEktaServicesData
  }
}
