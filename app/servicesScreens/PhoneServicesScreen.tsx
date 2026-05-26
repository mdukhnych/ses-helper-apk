import React, { useEffect, useMemo } from 'react'
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';
import { Text } from '@/components/Themed';
import { ScrollView } from '@/components/ui/scroll-view';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import PhoneServicesModal from '@/components/PhoneServicesModal';


export default function PhoneServicesScreen() {
  const { servicesItems } = useServicesStore(state => state.phoneServicesStore);
  const { fetchPhoneServices } = useFirestore();

  useEffect(() => {
    fetchPhoneServices();
  }, []);

   const sortedPhoneServices = useMemo(() => {
    if (!servicesItems) return [];

    return [...servicesItems].sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [servicesItems]);

  return (
    <ScrollView 
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Accordion
        size="md"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        className="gap-2 bg-transparent w-full"
      >
        {
          sortedPhoneServices.map(item => (
            <AccordionItem 
              key={item.id} 
              value={item.id} 
              className="border border-outline-200 rounded-xl overflow-hidden py-2"
            >
              <AccordionHeader>
                <AccordionTrigger className="flex-row items-center gap-4">
                    <Text className="flex-1 text-md font-bold" numberOfLines={2}>{item.title}</Text>
                    <Text className="text-md font-bold shrink-0">{item.price}</Text>
                  </AccordionTrigger>
              </AccordionHeader>
              
              <AccordionContent className="gap-2 border-t border-outline-200 pt-2">
                {
                  item.items.map((subItem, i) => (
                    <React.Fragment key={subItem.id}>
                      <PhoneServicesModal id={subItem.id}/>
                      {
                        item.items.length - 1 > i && <Divider />
                      }
                    </React.Fragment>
                  ))
                }
              </AccordionContent>
            </AccordionItem>
          ))
        }
      </Accordion>
    </ScrollView>
  )
}


