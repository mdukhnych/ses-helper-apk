import { Center } from '@/components/ui/center';
import { useState } from 'react';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  return (
    <Center className="h-full p-2">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full">
        <VStack className="gap-4">
          <Heading className="text-typography-900 text-center" >Login</Heading>
          <VStack space="xs">
            <Text className="text-typography-500">Email</Text>
            <Input>
              <InputField type="text" value={email} onChangeText={setEmail} />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500">Password</Text>
            <Input>
              <InputField type={showPassword ? 'text' : 'password'} value={password} onChangeText={setPassword} />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
          </VStack>
          <Button className="ml-auto">
            <ButtonText className="w-full text-center" onPress={() => {router.replace("/(tabs)/WarrantyScreen")}} >Вхід</ButtonText>
          </Button>
        </VStack>
      </FormControl>
    </Center>
  );
}
