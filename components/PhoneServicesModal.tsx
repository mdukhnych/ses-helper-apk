import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import React, { useState } from 'react';
import { Pressable } from './ui/pressable';
import { useServicesStore } from '@/store/useServicesStore';

export default function PhoneServicesModal({
  id,
}: {
  id: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const currentService = useServicesStore(state => state.phoneServicesStore.goodsAndServices.find(item => item.id === id));

  return (
    <>
      <Pressable onPress={() => setShowModal(true)} className="py-2">
        <Text>{currentService?.title || "---"}</Text>
      </Pressable>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="border-b border-outline-200 pb-4">
            <Heading size="sm">{currentService?.title || "---"}</Heading>
          </ModalHeader>
          <ModalBody className="p-0">
            <Text>{currentService?.description || "---"}</Text>
          </ModalBody>
          <ModalFooter className="border-t border-outline-200 pt-4">
            <Button
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Закрити</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
