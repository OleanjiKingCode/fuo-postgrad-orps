import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  Heading,
  Tr,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const HomePage = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [refetchData, setRefetchData] = useState(false);
  const [allUsersData, setAllUsersData] = useState();
  const [userData, setUserData] = useState();
  const [userRole, setUserRole] = useState("");

  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/User/${email}`);
      if (response) {
        const data = await response.data;
        setUserData(data);
        setUserRole(data.role);
        const response4 = await axios.get(`/api/User`);
        if (response4) {
          const dptUsers = response4.data.filter(
            (obj) => obj.department === data.department
          );
          setAllUsersData(dptUsers);
        }
      }
    };
    fetchData();
  }, [session, refetchData]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState("");
  const [ca, setCA] = useState("");
  const [exams, setExams] = useState("");
  const [courseData, setCourseData] = useState([]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    const updatedData = student?.coursesAdded?.map((course) => ({
      ...course,
      attendance: course.attendance || "",
      ca: course.ca || "",
      exams: course.exams || "",
    }));
    console.log(student?.coursesAdded, updatedData);
    setCourseData(updatedData);
  };

  const handleInputChange = (index, field, value) => {
    console.log(courseData);
    setCourseData((prevData) =>
      prevData
        ? prevData.map((course, i) =>
            i === index ? { ...course, [field]: value } : course
          )
        : []
    );
  };

  const handleSaveChanges = async () => {
    const updatedStudent = {
      ...selectedStudent,
      coursesAdded: courseData,
    };
    console.log(updatedStudent, courseData); // Do something with the updated student object
    try {
      const result = await axios.put(`/api/User/${updatedStudent.email}`, {
        coursesAdded: courseData,
      });
      if (result) {
        setRefetchData((prevValue) => !prevValue);
        toast({
          title: "Successfully added Courses",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SidebarWithHeader>
      <Flex bg="white" w="full" p="2" direction="column">
        {userRole === "Lecturer" ? (
          <>
            <Heading fontSize="lg" p="2" textAlign="center">
              STUDENTS RESULTS{" "}
            </Heading>
            <HStack w="full" alignItems="start">
              <Box p={4} w="50%">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Students</Th>
                      <Th>Matric No</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allUsersData?.map((student, i) => (
                      <Tr
                        key={i}
                        cursor="pointer"
                        onClick={() => handleStudentClick(student)}
                        _hover={{ bg: "gray.200" }}
                      >
                        <Td>{(i += 1)}</Td>
                        <Td>{student.name}</Td>
                        <Td fontWeight="bold">{student.matricno}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              <Box
                p={4}
                w="60%"
                borderLeft="2px"
                borderLeftColor="gray.400"
                minH="70vh"
              >
                {selectedStudent ? (
                  <>
                    {selectedStudent?.coursesAdded?.length > 0 ? (
                      <>
                        <Table variant="striped" colorScheme="gray">
                          <Thead>
                            <Tr>
                              <Th>Courses</Th>
                              <Th>Attendance</Th>
                              <Th>CA</Th>
                              <Th>Exams</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedStudent?.coursesAdded?.map(
                              (course, index) => (
                                <>
                                  <Tr key={index} cursor="pointer">
                                    <Td>{course.name}</Td>
                                    <Td>
                                      <Input
                                        type="text"
                                        value={course.attendance}
                                        min={0}
                                        max={10}
                                        border="1px"
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "attendance",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Td>
                                    <Td>
                                      <Input
                                        type="text"
                                        min={0}
                                        max={30}
                                        value={course.ca}
                                        border="1px"
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "ca",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Td>
                                    <Td>
                                      <Input
                                        type="text"
                                        min={0}
                                        max={60}
                                        value={course.exams}
                                        border="1px"
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "exams",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Td>
                                  </Tr>
                                </>
                              )
                            )}
                          </Tbody>
                        </Table>
                        <HStack w="full" gap="10">
                          <Button
                            my={4}
                            colorScheme="green"
                            onClick={handleSaveChanges}
                          >
                            Save Changes
                          </Button>
                        </HStack>
                      </>
                    ) : (
                      <Box
                        w="full"
                        fontWeight="500"
                        textAlign="center"
                        h="full"
                        py="10"
                      >
                        <Text>
                          {" "}
                          STUDENT WITH MATRIC NUMBER :{" "}
                          {selectedStudent.matricno} HASNT REGISTERED ANY
                          COURSES
                        </Text>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    w="full"
                    h="100%"
                    fontWeight="semibold"
                    textAlign="center"
                  >
                    Please select a student
                  </Box>
                )}
              </Box>
            </HStack>
          </>
        ) : (
          <Flex
            p={4}
            w="full"
            minH="80vh"
            bg="white"
            fontWeight="semibold"
            fontSize="lg"
            justifyContent="center"
            alignItems="center"
          >
            Results are currently unavailable
          </Flex>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
