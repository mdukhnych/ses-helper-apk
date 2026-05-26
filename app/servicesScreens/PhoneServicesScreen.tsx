import React, { useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native';
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';
import { Text } from '@/components/Themed';
import { ScrollView } from '@/components/ui/scroll-view';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Divider } from '@/components/ui/divider';
import PhoneServicesModal from '@/components/PhoneServicesModal';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import DocViewer from '@/components/DocViewer';
import { generatePhoneServicesPdf } from '@/utils/phoneServicesPdf';


export default function PhoneServicesScreen() {
  const phoneServicesData = useServicesStore(state => state.phoneServicesStore);
  const { servicesItems } = phoneServicesData;
  const { fetchPhoneServices } = useFirestore();
  const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    fetchPhoneServices();
  }, [fetchPhoneServices]);

  const sortedPhoneServices = useMemo(() => {
    if (!servicesItems) return [];

    return [...servicesItems].sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [servicesItems]);

  const handleGeneratePdf = async () => {
    if (servicesItems.length === 0) {
      Alert.alert('PDF', 'Немає даних для генерації PDF');
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const uri = await generatePhoneServicesPdf(phoneServicesData);
      setGeneratedPdfUri(uri);
    } catch (error) {
      console.log('Phone services PDF generation error:', error);
      Alert.alert('PDF', 'Не вдалося згенерувати PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (generatedPdfUri) {
    return (
      <Box className="flex-1 bg-white">
        <DocViewer url={generatedPdfUri} />
      </Box>
    );
  }

  return (
    <ScrollView 
      className="h-full px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Button
        className="mt-4"
        onPress={handleGeneratePdf}
        isDisabled={isGeneratingPdf}
      >
        {isGeneratingPdf && <ButtonSpinner color="#ffffff" />}
        <ButtonText>
          {isGeneratingPdf ? 'Генерація...' : 'Згенерувати PDF'}
        </ButtonText>
      </Button>
      <Divider className="my-4" />
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


