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
  InputRightElement,
  Input,
  Text,
  useToast,
  Select,
  HStack,
  Spinner,
  Switch,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";

const Students = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [users, setUsers] = useState([]);
  const [dept, setDept] = useState([]);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);

  const {
    handleSubmit,
    register,
    getValues,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async ({ name, email, password, dept }) => {
    try {
      const data = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        dept,
      });

      if (data.data) {
        setRefetchData(!refetchData);
        toast({
          title: "Lecturer Created Successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
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
      const response4 = await axios.get(`/api/User`);
      if (response4) {
        const Users = response4.data.filter((obj) => obj.role === "Lecturer");
        console.log(Users);
        setUsers(Users);
      }
      const response = await axios.get(`/api/Dept`);
      if (response) {
        setDept(response.data);
      }
    };
    fetchData();
  }, [session, refetchData]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const changeEditResultState = async (email, newVal) => {
    try {
      console.log("zdkcjbjsd", typeof newVal, newVal);
      const result = await axios.put(`/api/User/${email}`, {
        canEditResult: newVal,
      });
      if (result) {
        setRefetchData(!refetchData);
        toast({
          title: "Successfully updated the ability of a lecturer ",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SidebarWithHeader>
      <VStack mt={4} p={4} w="full" bg="white">
        <VStack w="full" gap="3" py="4">
          <Heading fontSize="lg">LECTURERS </Heading>
        </VStack>
        <Box w="full" pb="5" overflowX="scroll">
          <Flex py="3" w="full" justifyContent="flex-end">
            <Button
              bg="green.500"
              _hover={{ bg: "green.700" }}
              color="white"
              onClick={onOpen}
            >
              Add New Lecturer
            </Button>
          </Flex>
          <Table variant="striped" pl="20" colorScheme="blue" w="full" py="20">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Lecturer Name</Th>
                <Th>Email</Th>
                <Th>Department</Th>
                <Th>Sex</Th>
                <Th>Phone Number</Th>
                <Th>Can Edit Result</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((lecturer, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{lecturer.name}</Td>
                  <Td>{lecturer.email}</Td>
                  <Td>{lecturer.department}</Td>
                  <Td>{lecturer.sex}</Td>
                  <Td>{lecturer.phoneNumber}</Td>
                  <Td>
                    {" "}
                    <Switch
                      id="canEditResult"
                      isChecked={lecturer.canEditResult}
                      onChange={(e) => {
                        console.log(e);
                        changeEditResultState(lecturer.email, e.target.value);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Lecturer</ModalHeader>
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
                        Full Name
                      </FormLabel>
                      <Input
                        color="black"
                        id="name"
                        type="text"
                        placeholder="Enter your Full name"
                        {...register("name", {
                          required: "Please enter your Full name",
                          minLength: {
                            value: 6,
                            message: "Full name should be more than 6 chars",
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
                      <FormLabel htmlFor="dept" color="black">
                        Department
                      </FormLabel>
                      <Select
                        placeholder="Select Department"
                        {...register("dept", {
                          required: "Please select a valid option",
                        })}
                        color="black"
                      >
                        {dept.map((dpt, i) => (
                          <option value={dpt.abbr} key={i}>
                            {dpt.name}
                          </option>
                        ))}
                      </Select>
                      {errors.dept && (
                        <Text color="red.500" py="1">
                          {errors.dept.message}
                        </Text>
                      )}
                    </FormControl>
                  </Box>

                  <Box w="full">
                    <FormControl isRequired>
                      <FormLabel htmlFor="email" color="black">
                        Email
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        color="black"
                        placeholder="Enter your email address"
                        {...register("email", {
                          required: "Please enter email",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                            message: "Please enter valid email",
                          },
                        })}
                      />
                      {errors.email && (
                        <Text color="red.500" py="1">
                          {errors.email.message}
                        </Text>
                      )}
                    </FormControl>
                  </Box>
                  <Box w="full">
                    <FormControl>
                      <FormLabel htmlFor="password" color="black">
                        Password
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          color="black"
                          type={show ? "text" : "password"}
                          id="password"
                          placeholder="Enter your password"
                          {...register("password", {
                            required: "Please enter password",
                            minLength: {
                              value: 6,
                              message: "password is more than 5 chars",
                            },
                          })}
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>

                      {errors.password && (
                        <Text color="red.500" py="1">
                          {errors.password.message}
                        </Text>
                      )}
                    </FormControl>
                  </Box>
                  <Box w="full">
                    <FormControl>
                      <FormLabel htmlFor="confirmPassword" color="black">
                        Confirm Password
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          id="confirmPassword"
                          color="black"
                          placeholder="Enter Confirm password"
                          {...register("confirmPassword", {
                            required: "Please enter confirm password",
                            validate: (value) =>
                              value === getValues("password"),
                            minLength: {
                              value: 6,
                              message: "password is more than 5 chars",
                            },
                          })}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleClickConfirm}
                          >
                            {showConfirm ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {errors.confirmPassword && (
                        <Text color="red.500" py="1">
                          {errors.confirmPassword.message}
                        </Text>
                      )}
                      {errors.confirmPassword &&
                        errors.confirmPassword.type === "validate" && (
                          <Text color="red.500" py="1">
                            Passwords do not match
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
                          "Create Lecturer"
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
