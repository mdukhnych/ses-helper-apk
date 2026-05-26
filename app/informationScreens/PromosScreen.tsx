import React, { useEffect } from 'react'
import useFirestore from '@/hooks/useFirestore';
import { useInformationStore } from '@/store/useInformationStore';
import { ScrollView } from '@/components/ui/scroll-view';
import { Accordion, AccordionContent, AccordionContentText, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import AttachmentPreview from '@/components/AttachmentPreview';

export default function PromosScreen() {
  const promos = useInformationStore(state => state.documentsDataStore.promos);
  const {fetchInformationsData } = useFirestore();

  useEffect(() => {
    fetchInformationsData("promos");
  }, []);

  return (
    <ScrollView
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
    >
      <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="gap-2 bg-transparent"
        >
          {
            promos ?
              promos.map(item => (
                <AccordionItem key={item.id} value={item.id} className="border border-outline-200 rounded-xl overflow-hidden py-2">
                  <AccordionHeader>
                    <AccordionTrigger className="flex-row items-center gap-4">
                      <AccordionTitleText>{item.title}</AccordionTitleText>
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText className="border-t border-outline-200 pt-2">
                      {
                        item.description
                      }
                      
                    </AccordionContentText>
                    {item.sku ? (
                        <AttachmentPreview url={item.sku} />
                      ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))
            : <Spinner size={"large"} />
          }
        </Accordion>
    </ScrollView>
  )
}