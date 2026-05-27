import React, { useEffect, useState } from 'react'
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Info, X } from 'lucide-react-native';
import { Divider } from '@/components/ui/divider';
import { ScrollView } from '@/components/ui/scroll-view';
import { useServicesStore } from '@/store/useServicesStore';
import useFirestore from '@/hooks/useFirestore';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'expo-router';

export default function EasyProScreen() {
  const [searchValue, setSearchValue] = useState("");
  const pricelist = useServicesStore(state => state.easyproDataStore.pricelist);
  const { fetchEasyPro } = useFirestore();
  const router = useRouter();

  useEffect(() => {
    fetchEasyPro();
  }, []);

  const filteredPricelist = pricelist.filter(item => 
    item.model.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isLoading = pricelist.length === 0;

  return (
    <Box className="p-4 gap-4 h-full">
      <Box className="flex-row gap-4 justify-between items-center">
        <Input 
          size="lg"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false} 
          className="flex-1" 
        >
          <InputField type="text" placeholder="Введіть модель пристрою..." value={searchValue} onChangeText={setSearchValue} />
          {
            searchValue.length > 0 &&
              <InputSlot className="pr-3" onPress={() => setSearchValue("")}>
                <InputIcon as={X} />
              </InputSlot>
          }
        </Input>
        <Pressable onPress={() => router.push("/servicesScreens/easypro/EasyProDescriptionScreen")}>
          <Icon as={Info} size="xl" />
        </Pressable>
        </Box>
        <Divider className="my-0.5" />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {
            isLoading ? (
              <Spinner size={"large"} />
            ) : filteredPricelist.length > 0 ? (
              <Accordion
                  size="md"
                  variant="filled"
                  type="single"
                  isCollapsible={true}
                  isDisabled={false}
                  className="gap-2 bg-transparent"
                >
                  {
                    filteredPricelist.map(item => (
                      <AccordionItem 
                        key={item.model} 
                        value={item.model} 
                        className="border border-outline-200 rounded-xl overflow-hidden py-2"
                      >
                        <AccordionHeader>
                          <AccordionTrigger className="flex-row items-center gap-4">
                            <AccordionTitleText>{item.model}</AccordionTitleText>
                          </AccordionTrigger>
                        </AccordionHeader>
                        
                        <AccordionContent className="gap-2 border-t border-outline-200 pt-2 bg-transparent">
                          { item.easypro && (
                            <Card className="flex-row justify-between border border-outline-200 bg-transparent">
                              <Text>Easy Pro</Text>
                              <Text>{item.easypro}</Text>
                            </Card> 
                          )}
                          { item.easypro2 && (
                            <Card className="flex-row justify-between border border-outline-200 bg-transparent">
                              <Text>Easy Pro +2</Text>
                              <Text>{item.easypro2}</Text>
                            </Card> 
                          )}
                          { item.easypro3 && (
                            <Card className="flex-row justify-between border border-outline-200 bg-transparent">
                              <Text>Easy Pro +3</Text>
                              <Text>{item.easypro3}</Text>
                            </Card> 
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  }
                </Accordion>
            ) : (
                <Text className="text-center mt-4 opacity-50">
                  За запитом "{searchValue}" нічого не знайдено
                </Text>
              )
          }
        </ScrollView>
    </Box>
  )
}