import React, { useEffect } from 'react'
import useFirestore from '@/hooks/useFirestore';
import { useInformationStore } from '@/store/useInformationStore';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/Themed';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';

export default function InformationScreen() {
  const information = useInformationStore(state => state.information);

  const { fetchInformation } = useFirestore();
  const router = useRouter();

  useEffect(() => {
    fetchInformation();
  }, []);

  return (
    <ScrollView>
      <Box className="p-2 gap-2">
        {
          information ?
            Object.entries(information).map(([key, value]) => (
              <Pressable className="border border-outline-200 rounded-lg overflow-hidden" key={key} onPress={() => {
                  router.push({
                    pathname: "/informationScreens/[screenId]", 
                    params: { serviceId: key } 
                  });
                }}>
                  <Card className="py-8">
                    <Text className="text-xl">{value.title}</Text>
                  </Card>
              </Pressable>
            )) : null
        }
      </Box>
    </ScrollView>
  )
}