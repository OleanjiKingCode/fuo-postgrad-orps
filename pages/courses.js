import SidebarWithHeader from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  Flex,
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const Courses = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();
  const [deptData, setDeptData] = useState();
  const [userRole, setUserRole] = useState("");
  const [userDept, setUserDept] = useState("");
  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/User/${email}`);
      if (response) {
        const data = await response.data;
        setUserRole(data.role);
        setUserDept(data.department);
        setUserData(data);
        const response2 = await axios.get(`/api/Dept/${data.department}`);
        if (response2) {
          const data2 = await response2.data;
          setDeptData(data2);
        }
      }
    };
    fetchData();
  }, [email, session]);

  return (
    <SidebarWithHeader>
      <Flex>
        {deptData?.courses?.length === 0 ? (
          userRole === "lecturer" ? (
            <Box p={4} w="full" bg="white">
              <Heading fontSize="lg" w="full" py="5" textAlign="center">
                ADD COURSES
              </Heading>
              <Flex justifyContent="space-between" mb={4} gap={2} px="10%">
                <Flex alignItems="center" justifyContent="center">
                  <Text>{deptData?.name}</Text>
                </Flex>
                <Flex alignItems="center" justifyContent="center" gap={3}>
                  <Text>Maximum Number Of Courses</Text>
                  <Input placeholder="Number" w="20%" />
                </Flex>

                <Flex alignItems="center" justifyContent="center" gap={3}>
                  <Text>Maximum Number Of Units</Text>
                  <Input placeholder="Number" w="20%" />
                </Flex>
              </Flex>
              <VStack mt={4}>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 1)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 5)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 9)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 13)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 17)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 21)}</span>
                        <Input placeholder="Course" flex="8" mr={2} />
                        <Input placeholder="Number" flex="2" />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
              </VStack>
              <Button my={4} colorScheme="green">
                Save Changes
              </Button>
            </Box>
          ) : (
            <Box p={4} w="full" bg="white">
              <Text>Contact your Lecturers to Update the courses</Text>
            </Box>
          )
        ) : userRole === "lecturer" ? (
          <span>List of students that have added the courses.</span>
        ) : (
          <span>List of the courses you added.</span>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Courses;
