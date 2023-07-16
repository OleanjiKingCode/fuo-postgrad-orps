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
  chakra,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import SchoolResultDocument from "./pdfResult";
import { PDFDownloadLink } from "@react-pdf/renderer";

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
              align="center"
              // justify="center"
              minHeight="100vh"
            >
              <Image
                src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                alt="Student Image"
                boxSize="200px"
                borderRadius="full"
                mb={4}
              />
              <VStack
                spacing={4}
                w="full"
                textAlign="center"
                justifyContent="center"
              >
                <chakra.div py={3} px={5} w="full" fontWeight="bold">
                  {userData?.name}
                </chakra.div>

                <chakra.div py={3} px={5} w="full">
                  {userData?.matricno}
                </chakra.div>

                <chakra.div py={3} px={5} w="full">
                  {userData?.department}
                </chakra.div>

                <chakra.div py={3} px={5} w="full">
                  {userData?.phoneNumber}
                </chakra.div>
              </VStack>
            </Flex>
          </Box>
        </Container>
        
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
