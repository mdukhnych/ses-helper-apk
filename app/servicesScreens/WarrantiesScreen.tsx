import { ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Text } from '@/components/Themed';
import useFirestore from '@/hooks/useFirestore';
import { useServicesStore } from '@/store/useServicesStore';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionContentText,
} from '@/components/ui/accordion';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { X } from 'lucide-react-native';
import { Divider } from '@/components/ui/divider';

export default function WarrantiesScreen() {
  const { fetchWarranties, isLoading } = useFirestore();
  const { warrantiesDataStore } = useServicesStore(state => state);
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchWarranties();
  }, []);

  const sortedWarranties = useMemo(() => {
    if (!warrantiesDataStore) return [];

    return [...warrantiesDataStore].sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [warrantiesDataStore]);

  return (
    <Box className="p-4 gap-4 ">
      <Input 
        variant="rounded"
        size="lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}  
      >
        <InputField type="text" keyboardType="numeric" placeholder="Введіть вартість пристрою..." value={price} onChangeText={setPrice} />
        {
          price.length > 0 &&
            <InputSlot className="pr-3" onPress={() => setPrice("")}>
              <InputIcon as={X} />
            </InputSlot>
        }
      </Input>
      <Divider className="my-0.5" />
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
            sortedWarranties.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border border-outline-200 rounded-xl overflow-hidden py-2">
                <AccordionHeader>
                  <AccordionTrigger className="flex-row items-center gap-4">
                    <Text className="flex-1 text-md font-bold" numberOfLines={2}>
                      {item.title}
                    </Text>

                    <Text className="text-md font-bold shrink-0">
                      {(+price * item.price).toFixed(2)}
                    </Text>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <AccordionContentText className="border-t border-outline-200 pt-2">
                    {
                      item.description
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