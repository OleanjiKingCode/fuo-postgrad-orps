import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SidebarWithHeader from "@/components/Sidebar";
import {
  Flex,
  HStack,
  Text,
  useToast,
  Image,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const Settings = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [refetchData, setRefetchData] = useState(false);
  const [userData, setUserData] = useState();
  const [userRole, setUserRole] = useState("");
  const [newName, setNewName] = useState("");
  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/User/${email}`);
      if (response) {
        const data = await response.data;
        setUserData(data);
        setUserRole(data.role);
      }
    };
    fetchData();
  }, [session, refetchData]);

  const handleSaveChanges = async () => {
    try {
      const result = await axios.put(`/api/User/${userData?.email}`, {
        name: newName,
      });
      if (result) {
        setRefetchData((prevValue) => !prevValue);
        toast({
          title: "Successfully updated info",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <SidebarWithHeader>
      <Flex
        bg="white"
        w="full"
        alignItems="center"
        pr="12"
        pl="24"
        py="6"
        direction="column"
        gap="8"
      >
        <Image
          src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
          alt="Student Image"
          boxSize="200px"
          borderRadius="full"
          mb={4}
        />
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Name:
          </Text>

          <Input
            type="text"
            value={newName === "" ? userData?.name : newName}
            min={0}
            px="1"
            max={10}
            border="1px"
            onChange={(e) => setNewName(e.target.value)}
          />
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Matric Number:
          </Text>
          <Text w="50%">{userData?.matricno}</Text>
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Role:
          </Text>
          <Text w="50%">{userData?.role}</Text>
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Department:
          </Text>
          <Text w="50%">{userData?.department}</Text>
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Sex:
          </Text>
          <Text w="50%">{userData?.sex}</Text>
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            Email:
          </Text>
          <Text w="50%">{userData?.email}</Text>
        </HStack>
        <HStack w="full" px="3" justifyContent="space-between">
          <Text fontWeight="bold" w="50%">
            DOB:
          </Text>
          <Text w="50%">{Date(userData?.dob)}</Text>
        </HStack>

        <Button my={4} colorScheme="green" w="full" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Flex>
    </SidebarWithHeader>
  );
};

export default Settings;
