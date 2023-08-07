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
  Input,
  Text,
  useToast,
  HStack,
  Spinner,
  Icon,
  chakra,
} from "@chakra-ui/react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";

const Department = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [users, setUsers] = useState([]);
  const [chosenUser, setChosenUser] = useState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
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

  const [loading, setLoading] = useState(false);
  const [chosenDeptName, setChosenDeptName] = useState("");
  const [chosenDeptAbbr, setChosenDeptAbbr] = useState("");

  const getStudent = (index) => {
    setChosenUser(users[index]);
    setChosenDeptName(users[index].name);
    setChosenDeptAbbr(users[index].abbr);
    onOpenEdit();
  };

  const [maxUnitsNo, setMaxUnitsNo] = useState([0, 0, 0]);
  const [courseData, setCourseData] = useState([
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
  ]);

  const handleCourseChange = (index, value) => {
    const updatedCourseData = [...courseData];
    updatedCourseData[index].name = value;
    setCourseData(updatedCourseData);
  };

  const handleUnitsChange = (index, value) => {
    const updatedCourseData = [...courseData];
    updatedCourseData[index].units = value;
    setCourseData(updatedCourseData);
  };

  const submitCourses = async () => {
    setLoading(true);
    try {
      setLoading(true);
      if (chosenDeptName === "" || chosenDeptAbbr === "") {
        toast({
          title: "Fill the Name and Abbr of the Department",
          description: "",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      if (
        maxUnitsNo[0] <= 8 ||
        maxUnitsNo[0] > 16 ||
        maxUnitsNo[1] <= 8 ||
        maxUnitsNo[1] > 16 ||
        maxUnitsNo[2] <= 8 ||
        maxUnitsNo[2] > 16
      ) {
        toast({
          title: "Maximum number of courses should be within 9-16",
          description: "",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      // Validate the input fields
      let isValid = true;

      const minRequiredItems = 9;
      let totalUnitsInCourses = 0;
      let validCourseData = [];

      for (let i = 0; i < 16; i++) {
        const { name, units } = courseData[i];
        if (name.trim() !== "" && units.trim() !== "") {
          totalUnitsInCourses += Number(units);
          validCourseData.push(courseData[i]);
        }
      }

      let semesterSum = 0;

      for (let i = 0; i < maxUnitsNo.length; i++) {
        semesterSum += Number(maxUnitsNo[i]);
      }

      if (totalUnitsInCourses > semesterSum) {
        console.log(totalUnitsInCourses, semesterSum);
        toast({
          title: "Total Units in courses is greater than in all semesters",
          description: "",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });

        setLoading(false);
        return;
      }
      if (validCourseData.length < minRequiredItems) {
        isValid = false;
      }

      if (isValid) {
        try {
          console.log(chosenDeptName);
          const result = await axios.put(`/api/Dept/${chosenDeptName}`, {
            name: chosenDeptName,
            abbr: chosenDeptAbbr,
            courses: validCourseData,
            maxUnits: maxUnitsNo,
          });
          if (result) {
            setRefetchData((prevValue) => !prevValue);
            setRefetchData(true);
            toast({
              title: "Successfully added Courses",
              description: "",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          }
          setLoading(false);
          onCloseEdit();
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else {
        toast({
          title: "Input at least 9 courses ",
          description: "",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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
                <Th>Maximum Units [1st,2nd,3rd]</Th>

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
                  <Td>
                    [ {student.maxUnits[0]},{student.maxUnits[1]},{" "}
                    {student.maxUnits[2]} ]
                  </Td>
                  <Td>
                    <Button p="0" bg="none" onClick={() => getStudent(index)}>
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

        <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Edit{" "}
              <chakra.span color="green.500">{chosenUser?.name}</chakra.span>{" "}
              Department
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py="3">
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
                      value={chosenDeptName}
                      onChange={(e) => setChosenDeptName(e.target.value)}
                      placeholder="Enter department name"
                    />
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
                      value={chosenDeptAbbr}
                      onChange={(e) => {
                        setChosenDeptAbbr(e.target.value);
                      }}
                      placeholder="Enter an alias for the department"
                    />
                  </FormControl>
                </Box>
                <Box p={4} w="full" bg="white">
                  <Heading fontSize="lg" w="full" textAlign="center">
                    ADD COURSES
                  </Heading>

                  <Flex
                    alignItems="center"
                    direction="column"
                    justifyContent="center"
                    gap={3}
                    pt="2"
                    w="full"
                  >
                    <Text w="full">Maximum Number Of Units (Semester):</Text>
                    <HStack justifyContent="space-evenly">
                      <Text>1st</Text>
                      <Input
                        placeholder="Number"
                        onChange={(e) => {
                          const updatedUnits = [...maxUnitsNo];
                          updatedUnits[0] = e.target.value;
                          setMaxUnitsNo(updatedUnits);
                        }}
                        value={maxUnitsNo[0]}
                        w="20%"
                      />

                      <Text>2nd</Text>
                      <Input
                        placeholder="Number"
                        onChange={(e) => {
                          const updatedUnits = [...maxUnitsNo];
                          updatedUnits[1] = e.target.value;
                          setMaxUnitsNo(updatedUnits);
                        }}
                        value={maxUnitsNo[1]}
                        w="20%"
                      />

                      <Text>3rd</Text>
                      <Input
                        placeholder="Number"
                        onChange={(e) => {
                          const updatedUnits = [...maxUnitsNo];
                          updatedUnits[2] = e.target.value;
                          setMaxUnitsNo(updatedUnits);
                        }}
                        value={maxUnitsNo[2]}
                        w="20%"
                      />
                    </HStack>
                  </Flex>

                  <Box w="full" overflowX="scroll">
                    <VStack mt={4} w="full" p="2" alignItems="start">
                      <HStack spacing={4}>
                        {[...Array(4)].map((_, index) => (
                          <VStack key={index} spacing={2} align="center">
                            <Flex
                              gap="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <chakra.span px="2">{(index += 1)}</chakra.span>
                              <Input
                                id={`course-${index}`}
                                placeholder="Course"
                                flex="8"
                                mr={2}
                                value={courseData[index].name}
                                onChange={(e) =>
                                  handleCourseChange(index, e.target.value)
                                }
                                w="48"
                              />
                              <Input
                                id={`course-${index}`}
                                placeholder="No"
                                flex="2"
                                value={courseData[index].units}
                                onChange={(e) =>
                                  handleUnitsChange(index, e.target.value)
                                }
                                w="24"
                              />
                            </Flex>
                          </VStack>
                        ))}
                      </HStack>
                      <HStack spacing={4}>
                        {[...Array(4)].map((_, ind) => (
                          <VStack key={ind} spacing={2} align="center">
                            <Flex
                              gap="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <chakra.span px="2">{(ind += 5)}</chakra.span>
                              <Input
                                id={`course-${ind + 5}`}
                                placeholder="Course"
                                flex="8"
                                mr={2}
                                value={courseData[ind].name}
                                onChange={(e) =>
                                  handleCourseChange(ind, e.target.value)
                                }
                                w="48"
                              />
                              <Input
                                id={`course-${ind + 5}`}
                                placeholder="No"
                                flex="2"
                                value={courseData[ind].units}
                                onChange={(e) =>
                                  handleUnitsChange(ind, e.target.value)
                                }
                                w="24"
                              />
                            </Flex>
                          </VStack>
                        ))}
                      </HStack>
                      <HStack spacing={4}>
                        {[...Array(4)].map((_, i) => (
                          <VStack key={i} spacing={2} align="center">
                            <Flex
                              gap="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <chakra.span px="2">{(i += 9)}</chakra.span>
                              <Input
                                id={`course-${i + 9}`}
                                placeholder="Course"
                                flex="8"
                                mr={2}
                                value={courseData[i].name}
                                onChange={(e) =>
                                  handleCourseChange(i, e.target.value)
                                }
                                w="48"
                              />
                              <Input
                                id={`course-${i + 9}`}
                                placeholder="No"
                                flex="2"
                                value={courseData[i].units}
                                onChange={(e) =>
                                  handleUnitsChange(i, e.target.value)
                                }
                                w="24"
                              />
                            </Flex>
                          </VStack>
                        ))}
                      </HStack>
                      <HStack spacing={4}>
                        {[...Array(4)].map((_, inde) => (
                          <VStack key={inde} spacing={2} align="center">
                            <Flex
                              gap="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <chakra.span px="1">{(inde += 13)}</chakra.span>
                              <Input
                                id={`course-${inde + 13}`}
                                placeholder="Course"
                                flex="8"
                                mr={2}
                                value={courseData[inde].name}
                                onChange={(e) =>
                                  handleCourseChange(inde, e.target.value)
                                }
                                w="48"
                              />
                              <Input
                                id={`course-${inde + 13}`}
                                placeholder="No"
                                flex="2"
                                value={courseData[inde].units}
                                onChange={(e) =>
                                  handleUnitsChange(inde, e.target.value)
                                }
                                w="24"
                              />
                            </Flex>
                          </VStack>
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
                <HStack py="3" w="full" justifyContent="space-between">
                  <Button colorScheme="red" mr={3} onClick={onCloseEdit}>
                    Close
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={submitCourses}
                    isLoading={loading}
                  >
                    <Text color="white">Save Changes</Text>
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Department;