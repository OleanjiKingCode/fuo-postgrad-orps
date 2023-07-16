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
      const response4 = await axios.get(`/api/Dept`);
      if (response4) {
        setUsers(response4.data);
      }
    };
    fetchData();
  }, [session, refetchData]);

  return (
    <SidebarWithHeader>
      <VStack mt={4} p={4} w="full" bg="white">
        <VStack w="full" gap="3" py="4">
          <Heading fontSize="lg">Departments </Heading>
        </VStack>
        <Box w="full">
          <Table variant="striped" pl="20" colorScheme="blue" w="full" py="20">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Department Name</Th>
                <Th>Created By</Th>
                <Th>Courses</Th>
                <Th>Maximum Units</Th>
                <Th>Maximum Courses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((student, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{student.name}</Td>
                  <Td>{student.createdBy}</Td>
                  <Td>{student.courses.length}</Td>
                  <Td>{student.maxUnits}</Td>
                  <Td>{student.maxCourses}</Td>
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
