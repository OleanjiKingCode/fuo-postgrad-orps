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
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const Settings = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [refetchData, setRefetchData] = useState(false);
  const [userData, setUserData] = useState();
  const [, setUserRole] = useState("");
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const email = session?.user?.email;
  const [loadingBtn, setloadingBtn] = useState(false);

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
      setloadingBtn(true);
      const result = await axios.put(`/api/User/${userData?.email}`, {
        name: newName,
        phoneNumber: newNum,
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
      setloadingBtn(false);
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
        {userData ? (
          <>
            <Image
              src="pfp.png"
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
              <Text w="100%">{userData?.matricno}</Text>
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                Role:
              </Text>
              <Text w="100%">{userData?.role}</Text>
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                Department:
              </Text>
              <Text w="100%">{userData?.department}</Text>
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                Phone Number:
              </Text>

              <Input
                type="text"
                value={newNum === "" ? userData?.phoneNumber : newNum}
                min={0}
                px="1"
                max={10}
                border="1px"
                onChange={(e) => setNewNum(e.target.value)}
              />
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                Sex:
              </Text>
              <Text w="100%">{userData?.sex}</Text>
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                Email:
              </Text>
              <Text w="100%">{userData?.email}</Text>
            </HStack>
            <HStack w="full" px="3" justifyContent="space-between">
              <Text fontWeight="bold" w="50%">
                DOB:
              </Text>
              <Text w="100%">{Date(userData?.dob)}</Text>
            </HStack>
            <Button
              my={4}
              colorScheme="green"
              isLoading={loadingBtn}
              w="full"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Flex
            bg="white"
            w="full"
            px="32"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Flex>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Settings;
