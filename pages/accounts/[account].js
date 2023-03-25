import {
  Text,
  chakra,
  Circle,
  Flex,
  Heading,
  HStack,
  VStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/Layout";
import User from "../../components/models/userSchema";
import { useRouter } from "next/router";
import db from "../../utils/db";
import { useEffect } from "react";

export default function account(props) {
  const router = useRouter();
  const personEmail = router.query.account;
  useEffect(() => {
    if (personEmail === props.User.name) {
      toast({
        title: "Your email is ",
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [personEmail]);
  return (
    <Layout title="Account">
      <VStack gap={10} py="2" mx="auto" px="5" w="full">
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          py="5"
        >
          <Circle size="140px" bg="gray.800" />
          <Heading>{props.User.name}</Heading>
          <Text>Bio of the User Account or User</Text>
          <HStack w="full" spacing="8" px="20">
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <chakra.span color="white" fontWeight="medium">
                297
              </chakra.span>
              <Text fontSize="16px" fontWeight="bold">
                Followers
              </Text>
            </Flex>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <chakra.span color="white" fontWeight="medium">
                250
              </chakra.span>
              <Text fontSize="16px" fontWeight="bold">
                Following
              </Text>
            </Flex>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <chakra.span color="white" fontWeight="medium">
                127
              </chakra.span>
              <Text fontSize="16px" fontWeight="bold">
                Likes
              </Text>
            </Flex>
          </HStack>
        </Flex>
      </VStack>
      <Flex
        w="full"
        py={5}
        px={{ base: "10", md: "15", lg: "40" }}
        direction={{ base: "column", md: "row" }}
        gap="3"
      >
        <Box
          py="5"
          px="6"
          w="full"
          borderWidth="1px"
          rounded="2xl"
          bg="AppWorkspace"
        >
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of created CodeBits</Text>
            <chakra.span>27</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of created CodeTips</Text>
            <chakra.span>04</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of drafted CodeBits</Text>
            <chakra.span>04</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of drafted CodeTips</Text>
            <chakra.span>04</chakra.span>
          </Flex>
        </Box>
        <Box
          py="5"
          px="6"
          w="full"
          borderWidth="1px"
          rounded="2xl"
          bg="AppWorkspace"
        >
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of Likes received</Text>
            <chakra.span>026</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of Bookmarks received</Text>
            <chakra.span>65</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Total no of Bookmarks done</Text>
            <chakra.span>04</chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" w="full">
            <Text>Achievements</Text>
            <chakra.span>14</chakra.span>
          </Flex>
        </Box>
      </Flex>
      <Tabs mt="5" rounded="2xl" bg="whiteAlpha.400" py="4" px="5">
        <TabList>
          <Tab>Recent CodeBit</Tab>
          <Tab>Recent CodeTip</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <TableCaption>Recent Code Bits Activities</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Language</Th>
                    <Th>Description</Th>
                    <Th isNumeric>Likes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Styling Buttons</Td>
                    <Td>CSS</Td>
                    <Td>Styling Buttons is a simole technique...</Td>
                    <Td isNumeric>254</Td>
                  </Tr>
                  <Tr>
                    <Td>API Integration</Td>
                    <Td>C#</Td>
                    <Td>API Integration using C# programming lang...</Td>
                    <Td isNumeric>3048</Td>
                  </Tr>
                  <Tr>
                    <Td>Styling Buttons</Td>
                    <Td>CSS</Td>
                    <Td>Styling Buttons is a simole technique...</Td>
                    <Td isNumeric>254</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <TableCaption>Recent Code Tips Activities</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Language</Th>
                    <Th>Description</Th>
                    <Th isNumeric>Likes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>API Integration</Td>
                    <Td>C#</Td>
                    <Td>API Integration using C# programming lang...</Td>
                    <Td isNumeric>3048</Td>
                  </Tr>
                  <Tr>
                    <Td>Styling Buttons</Td>
                    <Td>CSS</Td>
                    <Td>Styling Buttons is a simole technique...</Td>
                    <Td isNumeric>254</Td>
                  </Tr>
                  <Tr>
                    <Td>API Integration</Td>
                    <Td>C#</Td>
                    <Td>API Integration using C# programming lang...</Td>
                    <Td isNumeric>3048</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  db.connect();
  const accEmail = context.params?.account;
  const acc = await User.findOne({ email: accEmail });

  return {
    props: {
      User: JSON.parse(JSON.stringify(acc)),
    },
  };
};
