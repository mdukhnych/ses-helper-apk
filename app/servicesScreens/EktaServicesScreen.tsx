import React, { useEffect } from 'react'
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollView } from '@/components/ui/scroll-view';
import { View, Text } from '@/components/Themed';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';
import { Center } from '@/components/ui/center';

export default function EktaServicesScreen() {
  const ektaServicesData = useServicesStore(state => state.ektaServicesStore);

  const { fetchEktaServicesData } = useFirestore();

  useEffect(() => {
    fetchEktaServicesData();
  }, []);

  return (
    <ScrollView 
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
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
                          <View  className="flex-row items-center gap-4 py-2">
                            <Text className="flex-1 " numberOfLines={3}>
                              {subItem.title}
                            </Text>

                            <Text className=" shrink-0">
                              {subItem.price}
                            </Text>
                          </View>
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