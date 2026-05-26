import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Text } from '@/components/ui/text'
import useFirestore from '@/hooks/useFirestore';
import { ScrollView } from '@/components/ui/scroll-view';
import { useInformationStore } from '@/store/useInformationStore';
import { Card } from '@/components/ui/card';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { Heading } from '@/components/ui/heading';
import { Spinner } from '@/components/ui/spinner';

export default function MotivationsScreen() {
  const motivations = useInformationStore(state => state.documentsDataStore.motivations);
  const { fetchInformationsData } = useFirestore();
  const router = useRouter();

  useEffect(() => {
    fetchInformationsData("motivations");
  }, []);

  return (
    <ScrollView 
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }} 
    >
        {
          motivations ?
            motivations.map(item => (
              <Card key={item.id} className="border border-outline-200 my-1">
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: '/informationScreens/DocumentViewer',
                      params: {
                        collectionKey: 'motivations',
                        id: item.id,
                      },
                    });
                  }}
                >
                <Heading size="md" className="mb-1">
                  {item.title}
                </Heading>
              </Pressable>
              </Card>
            ))
          : <Spinner/>
        }
      </ScrollView>
  )
}