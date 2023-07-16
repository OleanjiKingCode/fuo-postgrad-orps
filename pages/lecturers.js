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
} from "@chakra-ui/react";
import axios from "axios";

const Students = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response4 = await axios.get(`/api/User`);
      if (response4) {
        const Users = response4.data.filter((obj) => obj.role === "Lecturer");
        setUsers(Users);
      }
    };
    fetchData();
  }, [session, refetchData]);

  return (
    <SidebarWithHeader>
      <VStack mt={4} p={4} w="full" bg="white">
        <VStack w="full" gap="3" py="4">
          <Heading fontSize="lg">LECTURERS </Heading>
        </VStack>
        <Box w="full" overflowX="scroll">
          <Table variant="striped" pl="20" colorScheme="blue" w="full" py="20">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Lecturer Name</Th>
                <Th>Email</Th>
                <Th>Matric No</Th>
                <Th>Department</Th>

                <Th>Sex</Th>
                <Th>Phone Number</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((lecturer, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{lecturer.name}</Td>
                  <Td>{lecturer.email}</Td>
                  <Td>{lecturer.matricno}</Td>
                  <Td>{lecturer.department}</Td>
                  <Td>{lecturer.sex}</Td>
                  <Td>{lecturer.phoneNumber}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Students;
