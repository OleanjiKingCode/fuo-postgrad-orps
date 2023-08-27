import SidebarWithHeader from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  chakra,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { FcCancel, FcCheckmark } from "react-icons/fc";

const Students = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response4 = await axios.get(`/api/User`);
      if (response4) {
        const Users = response4.data.filter((obj) => obj.role === "Student");
        setUsers(Users);
      }
    };
    fetchData();
  }, [session, refetchData]);

  return (
    <SidebarWithHeader>
      <VStack mt={4} p={4} w="full" bg="white">
        <VStack w="full" gap="3" py="4">
          <Heading fontSize="lg">STUDENTS </Heading>
        </VStack>
        <Box
          w="full"
          overflowX="scroll"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table variant="striped" pl="20" colorScheme="blue" w="full" py="20">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Student Name</Th>
                <Th>Email</Th>
                <Th>Matric No</Th>
                <Th>Department</Th>
                <Th>Course Registered [1st, 2nd,3rd]</Th>
                <Th>Sex</Th>
                <Th>Result Ready</Th>
                <Th>Phone Number</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((student, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.matricno}</Td>
                    <Td>{student.department}</Td>
                    <Td w="full">
                      <HStack w="full" gap={{ base: "3", md: "5", lg: "7" }}>
                        <chakra.span px="3">
                          {" "}
                          {student.coursesAdded?.firstSemester?.length ?? 0},
                        </chakra.span>
                        <chakra.span px="3">
                          {" "}
                          {student.coursesAdded?.secondSemester?.length ?? 0},
                        </chakra.span>
                        <chakra.span px="3">
                          {student.coursesAdded?.thirdSemester?.length ?? 0}
                        </chakra.span>
                      </HStack>
                    </Td>
                    <Td>{student.sex}</Td>
                    <Td>
                      {student.resultReady ? (
                        <Icon as={FcCheckmark} />
                      ) : (
                        <Icon as={FcCancel} />
                      )}
                    </Td>
                    <Td>{student.phoneNumber}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Students;
