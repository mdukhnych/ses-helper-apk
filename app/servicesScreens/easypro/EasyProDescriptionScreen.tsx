import React from 'react';
import { Box } from '@/components/ui/box';
import { Stack } from 'expo-router';
import { useServicesStore } from '@/store/useServicesStore';
import { ScrollView } from '@/components/ui/scroll-view';
import { Accordion, AccordionContent, AccordionContentText, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';

export default function EasyProDescriptionScreen() {
  const description = useServicesStore(state => state.easyproDataStore.description);

  return (
    <Box className="py-4 px-2">
      <Stack.Screen options={{headerTitle: "Що таке Easy Pro"}} />
      <ScrollView>
        <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="gap-2 bg-transparent"
        >
          {
            description.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border border-outline-200 rounded-xl overflow-hidden py-2">
                <AccordionHeader>
                  <AccordionTrigger className="flex-row items-center gap-4">
                    <AccordionTitleText>Послуга SES: {item.shortName}</AccordionTitleText>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <AccordionContentText className="border-t border-outline-200 pt-2">
                    {
                      item.text
                    }
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </ScrollView>
    </Box>
  )
}