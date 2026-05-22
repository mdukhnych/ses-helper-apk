import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';
import WarrantiesScreen from './WarrantiesScreen';
import EasyProScreen from './easypro/EasyProScreen';
import { useServicesStore } from '@/store/useServicesStore';
import PhoneServicesScreen from './PhoneServicesScreen';
import EktaServicesScreen from './EktaServicesScreen';

export default function DynamicServiceRoute() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const headerTitle = useServicesStore(state => state.services?.find(item => item.id === serviceId)?.title);

  return (
    <View>
      <Stack.Screen options={{headerTitle: headerTitle}} />
      {
        serviceId === "warranty-protection" ? <WarrantiesScreen /> :
        serviceId === "easy-pro" ? <EasyProScreen /> :
        serviceId === "phone-services" ? <PhoneServicesScreen /> :
        serviceId === "ekta-services" ? <EktaServicesScreen /> :
        <Text>Сервіс із ID {serviceId} не знайдено</Text>
      }
    </View>
  )
}