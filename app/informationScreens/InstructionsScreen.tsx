import React, { useEffect, useState } from 'react'
import { Text } from '@/components/ui/text';
import { useInformationStore } from '@/store/useInformationStore';
import useFirestore from '@/hooks/useFirestore';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from '@/components/ui/box';

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';

import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from '@/components/ui/drawer';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';

export default function InstructionsScreen() {
  const instructions = useInformationStore(state => state.instructionsDataStore);
  const categories = useInformationStore(state => state.information?.instructions.categories);

  const [showDrawer, setShowDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCat, setSearchCat] = useState("");

  const { fetchInstructions } = useFirestore();

  useEffect(() => {
    fetchInstructions();
  }, []);

  const filteredInstructions = instructions?.filter(item => {
    const matchesTitle = item.title
      .toLowerCase()
      .includes(searchValue.toLowerCase().trim());

    const matchesCategory = searchCat
      ? item.categoryId === searchCat
      : true;

    return matchesTitle && matchesCategory;
  });

  console.log(instructions)

  return (
    <Box className="py-4 px-2">
      <Button
        onPress={() => {
          setShowDrawer(true);
        }}
      >
        <ButtonText>Пошук інструкцій</ButtonText>
      </Button>
      <Drawer
        isOpen={showDrawer}
        size="md"
        anchor="bottom"
        onClose={() => {
          setShowDrawer(false);
        }}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <Heading size="lg">Пошук інструкцій</Heading>
            <DrawerCloseButton>
              <Icon as={CloseIcon} />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody>
            <Box className="gap-4 border-b border-outline-200 pb-4">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Назва інструкції</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField placeholder="Введіть назву..." value={searchValue} onChangeText={setSearchValue} />
                </Input>
              </FormControl>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Виберіть категорію</FormControlLabelText>
                </FormControlLabel>
                <Select 
                  onValueChange={setSearchCat} 
                  defaultValue={
                    categories?.find(cat => cat.id === searchCat)?.title
                  }
                >
                  <SelectTrigger variant="outline" size="md" className="flex justify-between">
                    <SelectInput placeholder="Виберіть категорію" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label={"Всі"} value={""} />
                      {
                        categories?.map(item => (
                          <SelectItem key={item.id} label={item.title} value={item.id} />
                        ))
                      }
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              onPress={() => {
                setShowDrawer(false);
              }}
            >
              <ButtonText>Закрити</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      <ScrollView className="pt-4 border-t border-outline-200 mt-4">
        {
          instructions ?
            filteredInstructions.map(item => (
              <Card key={item.id} className="border border-outline-200 my-1">
                <Pressable>
                <Heading size="md" className="mb-1">
                  {item.title}
                </Heading>
                <Text size="sm">Категорія:  {categories?.find(cat => cat.id === item.categoryId)?.title || "    ------     "}
                </Text>
              </Pressable>
              </Card>
            ))
          : <Spinner/>
        }
      </ScrollView>
      
    </Box>
  )
}