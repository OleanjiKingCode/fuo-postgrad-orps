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
  const [attendance, setAttendance] = useState("");
  const [ca, setCA] = useState("");
  const [exams, setExams] = useState("");
  const [courseData, setCourseData] = useState([]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setCourseData(
      student.courses.map((course) => ({
        ...course,
        attendance: course.attendance || "",
        ca: course.ca || "",
        exams: course.exams || "",
      }))
    );
  };

  const handleInputChange = (index, field, value) => {
    setCourseData((prevData) =>
      prevData.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      )
    );
  };

  const handleSaveChanges = () => {
    const updatedStudent = {
      ...selectedStudent,
      courses: courseData,
    };
    console.log(updatedStudent); // Do something with the updated student object

    
  };

  return (
    <SidebarWithHeader>
      <Flex bg="white" w="full" p="2" direction="column">
        <Heading fontSize="lg" p="2">
          STUDENTS RESULTS{" "}
        </Heading>
        <HStack w="full" alignItems="start">
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
                  {selectedStudent.courses.length > 0 ? (
                    <>
                      {selectedStudent?.courses.map((course, index) => (
                        <Tr key={course.units} cursor="pointer">
                          <Td>{course.name}</Td>
                          <Td>
                            <Input
                              type="text"
                              value={course.attendance}
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
                              value={course.ca}
                              onChange={(e) =>
                                handleInputChange(index, "ca", e.target.value)
                              }
                            />
                          </Td>
                          <Td>
                            <Input
                              type="text"
                              value={course.exams}
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
                      ))}
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
                    <Text w="full" fontWeight="bold">
                      STUDENT HASNT REGISTERED ANY COURSES
                    </Text>
                  )}
                </Tbody>
              </Table>
            ) : (
              <Text>Please select a student</Text>
            )}
          </Box>
        </HStack>
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
