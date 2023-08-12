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
        console.log(Users);
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
                <Th>Course Registered</Th>
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
                    <Td>{student.coursesAdded.length}</Td>
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
