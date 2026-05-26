import React, { useEffect } from 'react'
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollView } from '@/components/ui/scroll-view';
import { View, Text } from '@/components/Themed';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';
import { Center } from '@/components/ui/center';
import { Pressable } from '@/components/ui/pressable';

export default function EktaServicesScreen() {
  const ektaServicesData = useServicesStore(state => state.ektaServicesStore);
  const router = useRouter();

  const { fetchEktaServicesData } = useFirestore();

  useEffect(() => {
    fetchEktaServicesData();
  }, [fetchEktaServicesData]);

  const openDocument = (groupId: string, documentId: string, url: string) => {
    if (!url) {
      Alert.alert('Документ', 'У послуги немає посилання на файл');
      return;
    }

    router.push({
      pathname: '/servicesScreens/EktaDocumentViewer',
      params: {
        groupId,
        documentId,
      },
    });
  };

  return (
    <ScrollView 
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
    >
      {
        ektaServicesData.length > 0 ? 
          <Accordion
            size="md"
            variant="filled"
            type="single"
            isCollapsible={true}
            isDisabled={false}
            className="gap-2 bg-transparent"
          >
            {
              ektaServicesData.map(item => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className="border border-outline-200 rounded-xl overflow-hidden py-2"
                >
                  <AccordionHeader>
                    <AccordionTrigger className="flex-row items-center gap-4">
                      <AccordionTitleText>{item.title}</AccordionTitleText>
                    </AccordionTrigger>
                  </AccordionHeader>
                  
                  <AccordionContent className="gap-2 border-t border-outline-200 pt-2 bg-transparent">
                    {
                      item.list.map((subItem, i) => (
                        <React.Fragment key={subItem.id}>
                          <Pressable
                            className="py-2"
                            onPress={() => openDocument(item.id, subItem.id, subItem.description)}
                          >
                            <View className="flex-row items-center gap-4">
                              <Text className="flex-1" numberOfLines={3}>
                                {subItem.title}
                              </Text>

                              <Text className="shrink-0">
                                {subItem.price}
                              </Text>
                            </View>
                          </Pressable>
                          { item.list.length-1 > i && <Divider/> }
                        </React.Fragment>
                      ))
                    }
                  </AccordionContent> 
                </AccordionItem>
              ))
            }
          </Accordion>
        : <Center className="h-full"><Spinner size={"large"}/></Center>
      }
    </ScrollView>
  )
}
