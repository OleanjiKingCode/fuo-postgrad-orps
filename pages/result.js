import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import SidebarWithHeader from "@/components/Sidebar";
import {
  Box,
  Flex,
  HStack,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

const HomePage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();

  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const response4 = await axios.get(`/api/User`);
      if (response4) {
        setUserData(response4.data);
      }
    };
    fetchData();
  }, [email, session]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <SidebarWithHeader>
      <Flex bg="white" w="full" p="2">
        <Box p={4} w="40%">
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Students</Th>
                <Th>Matric No</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userData?.map((student, index) => (
                <Tr
                  key={student.id}
                  cursor="pointer"
                  onClick={() => handleStudentClick(student)}
                  _hover={{ bg: "gray.200" }}
                >
                  <Td>{(index += 1)}</Td>
                  <Td>{student.name}</Td>
                  <Td fontWeight="bold">{student.matricno}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box p={4} w="70%" borderLeft="2px" borderLeftColor="gray.400">
          {selectedStudent ? (
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>Courses</Th>
                  <Th>Attendance</Th>
                  <Th>CA</Th>
                  <Th>Exams</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedStudent.courses.length > 0 ? (
                  <>
                    {selectedStudent?.courses.map((student) => (
                      <Tr key={student.units} cursor="pointer">
                        <Td>{student.name}</Td>
                        <Td>Attendance</Td>
                        <Td>CA</Td>
                        <Td>EXAMS</Td>
                      </Tr>
                    ))}
                    <HStack w="full" gap="10">
                      <Button my={4} colorScheme="green">
                        Save Changes
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <Text w="full" fontWeight="bold" textAlign="center">
                    STUDENT HASNT REGISTERED ANY COURSES
                  </Text>
                )}
              </Tbody>
            </Table>
          ) : (
            <Text>Please select a student</Text>
          )}
        </Box>
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
