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
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Text,
  useToast,
  HStack,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";

const Students = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const email = session?.user?.email;
  const {
    handleSubmit,
    register,
    getValues,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async ({ name, alias }) => {
    try {
      const data = await axios.post("/api/Dept", {
        name,
        abbr: alias,
        email,
      });

      if (data.data) {
        setRefetchData(!refetchData);
        toast({
          title: "Department Created Successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      reset();
      resetField();
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: `${error.response.data.message}`,
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
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
        <Flex py="3" w="full" justifyContent="flex-end">
          <Button
            bg="green.500"
            _hover={{ bg: "green.700" }}
            color="white"
            onClick={onOpen}
          >
            Add New Department
          </Button>
        </Flex>
        <Box w="full" overflowX="scroll" py="3">
          <Table variant="striped" pl="20" colorScheme="blue" w="full" py="20">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Department Name</Th>
                <Th>Department Alias</Th>
                <Th>Created By</Th>
                <Th>Courses</Th>
                <Th>Maximum Units</Th>
                <Th>Maximum Courses</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((student, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{student.name}</Td>
                  <Td>{student.abbr}</Td>
                  <Td>{student.createdBy}</Td>
                  <Td>{student.courses.length}</Td>
                  <Td>{student.maxUnits}</Td>
                  <Td>{student.maxCourses}</Td>
                  <Td>
                    <Button p="0" bg="none">
                      <Icon as={FaEdit} />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Department</ModalHeader>
            <ModalCloseButton />
            <ModalBody py="3">
              <form
                onSubmit={handleSubmit(submitHandler)}
                style={{ width: "inherit" }}
              >
                <VStack gap="3" w="full">
                  <Box w="full">
                    <FormControl isRequired>
                      <FormLabel htmlFor="name" color="black">
                        Department Name
                      </FormLabel>
                      <Input
                        color="black"
                        id="name"
                        type="text"
                        placeholder="Enter department name"
                        {...register("name", {
                          required: "Please enter the department name",
                          minLength: {
                            value: 6,
                            message:
                              "Department name should be more than 6 chars",
                          },
                        })}
                      />
                      {errors.name && (
                        <Text color="red.500" py="1">
                          {errors.name.message}
                        </Text>
                      )}
                    </FormControl>
                  </Box>
                  <Box w="full">
                    <FormControl isRequired>
                      <FormLabel htmlFor="alias" color="black">
                        Department Alias
                      </FormLabel>
                      <Input
                        color="black"
                        id="alias"
                        type="text"
                        placeholder="Enter an alias for the department"
                        {...register("alias", {
                          required: "Please enter an alias",
                          minLength: {
                            value: 2,
                            message:
                              "Department alias should be more than 2 chars",
                          },
                        })}
                      />
                      {errors.alias && (
                        <Text color="red.500" py="1">
                          {errors.alias.message}
                        </Text>
                      )}
                    </FormControl>
                  </Box>

                  <HStack py="3" w="full" justifyContent="space-between">
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button colorScheme="green" type="submit">
                      <Text color="white">
                        {isSubmitting ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Create Department"
                        )}
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Students;
