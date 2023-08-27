import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import SidebarWithHeader from "@/components/Sidebar";
import {
  Flex,
  Container,
  Box,
  Image,
  VStack,
  Spinner,
  chakra,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const HomePage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();

  const email = session?.user?.email;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/User/${email}`);
      if (response) {
        const data = await response.data;
        setUserData(data);
      }
    };
    fetchData();
  }, [email, session]);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }

  return (
    <SidebarWithHeader>
      <Flex>
        <Container maxW={"7xl"}>
          <Box
            bg="white"
            py="3"
            px={8}
            boxShadow="md"
            borderRadius="md"
            width="full"
          >
            <Flex
              direction="column"
              alignItems="center"
              minHeight="100vh"
            >
              <Image
                src="./pfp.png"
                alt="Student Image"
                boxSize="200px"
                borderRadius="full"
                mb={4}
              />
              {userData ? (
                <VStack
                  spacing={4}
                  w="full"
                  alignItems="center"
                  justifyContent="center"
                  overflowX="scroll"
                  mt="10"
                  sx={{
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      Name:
                    </Text>
                    <Text>{userData?.name}</Text>
                  </HStack>
                  {userData?.role === "Student" && (
                    <HStack
                      w={{ base: "full", md: "70%", lg: "50%" }}
                      px="3"
                      gap="5"
                    >
                      <Text fontWeight="bold" w="40">
                        Matric Number:
                      </Text>
                      <Text>{userData?.matricno}</Text>
                    </HStack>
                  )}
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      Role:
                    </Text>
                    <Text>{userData?.role}</Text>
                  </HStack>
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      Department:
                    </Text>
                    <Text>{userData?.department}</Text>
                  </HStack>
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      Sex:
                    </Text>
                    <Text>{userData?.sex}</Text>
                  </HStack>
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      Email:
                    </Text>
                    <Text>{userData?.email}</Text>
                  </HStack>
                  <HStack
                    w={{ base: "full", md: "70%", lg: "50%" }}
                    px="3"
                    gap="5"
                  >
                    <Text fontWeight="bold" w="40">
                      DOB:
                    </Text>
                    <Text>{formatDate(String(userData?.dob))}</Text>
                  </HStack>
                </VStack>
              ) : (
                <Flex
                  bg="white"
                  w="full"
                  px="32"
                  mt="28"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner />
                </Flex>
              )}
            </Flex>
          </Box>
        </Container>
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
