import { ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';

export default function ServicesScreen() {
  const { fetchServices, isLoading: servicesLoading } = useFirestore();
  const services = useServicesStore(state => state.services);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const sortedServices = useMemo(() => {
    if (!services) return [];

    return [...services].sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [services]);

  return (
    <ScrollView >
      <Box className="p-2 gap-2">
        {
          services ?
            sortedServices.map(service => (
              <Pressable key={service.id} onPress={() => {
                router.push({
                  pathname: "/servicesScreens/[serviceId]", 
                  params: { serviceId: service.id } 
                });
              }}>
                <Card className="py-8">
                  <Text className="text-xl">{service.title}</Text>
                </Card>
              </Pressable>
            ))
          : <Spinner/>
        }
      </Box>
    </ScrollView>
  )
}
