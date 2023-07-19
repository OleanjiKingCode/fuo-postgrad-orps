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
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Document,
  Page,
  View,
  Text as Texxt,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const HomePage = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [refetchData, setRefetchData] = useState(false);
  const [allUsersData, setAllUsersData] = useState();
  const [userData, setUserData] = useState();
  const [resultData, setResultData] = useState();
  const [userRole, setUserRole] = useState("");

  const email = session?.user?.email;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            (obj) =>
              obj.department === data.department && obj.role === "Student"
          );
          setAllUsersData(dptUsers);
        }
      }
    };
    fetchData();
  }, [session, refetchData]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDisplay, setIsDisplay] = useState(false);

  const [courseData, setCourseData] = useState([]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);

    const updatedData = student?.coursesAdded?.map((course) => ({
      ...course,
      attendance: course.attendance || "",
      ca: course.ca || "",
      exams: course.exams || "",
    }));
    isAllCoursesFilled(updatedData);
    setCourseData(updatedData);
  };

  const handleInputChange = (index, field, value) => {
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
    isAllCoursesFilled(courseData);
    try {
      const result = await axios.put(`/api/User/${updatedStudent.email}`, {
        coursesAdded: courseData,
        resultReady: isDisplay,
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

  const isAllCoursesFilled = (courses) => {
    let data =
      courses !== null
        ? courses?.map((item) => {
            if (item.ca === "" || item.attendance === "" || item.exams === "") {
              return false;
            }
            return true;
          })
        : selectedStudent.coursesAdded?.map((item) => {
            if (item.ca === "" || item.attendance === "" || item.exams === "") {
              return false;
            }
            return true;
          });
    data = data.every((value) => value === true);
    setIsDisplay(data);
    if (data === true) {
      calculateGrades(courses ?? selectedStudent?.coursesAdded);
    }
  };

  const calculateGrades = (courses) => {
    let totalScore = 0;

    const gradedCourses = courses?.map((course) => {
      const { name, exams, attendance, ca, units } = course;

      const totalScoreCourse = Number(ca) + Number(attendance) + Number(exams);
      totalScore += totalScoreCourse;

      let grade;

      if (totalScoreCourse >= 70) {
        grade = "A";
      } else if (totalScoreCourse >= 60) {
        grade = "B";
      } else if (totalScoreCourse >= 50) {
        grade = "C";
      } else if (totalScoreCourse >= 45) {
        grade = "D";
      } else if (totalScoreCourse >= 40) {
        grade = "E";
      } else {
        grade = "F";
      }

      return { courses: name, score: totalScoreCourse, grade, units };
    });

    const averageScore = ((totalScore / (courses?.length * 100)) * 100).toFixed(
      2
    );
    let status;

    if (averageScore > 60) {
      status = "Eligible to start PHD";
    } else if (averageScore >= 55 && averageScore <= 59.9) {
      status = "MPhil PHD";
    } else if (averageScore >= 50 && averageScore <= 54.9) {
      status = "MPhil";
    } else {
      status = "Certificate of Attendance";
    }

    setResultData({ gradedCourses, averageScore, status });
    return { gradedCourses, averageScore, status };
  };

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 16,
      padding: "20px",
    },
    heading: {
      fontSize: 20,
      marginBottom: "10px",
      fontWeight: "bold",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    rowsection: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 10,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: "60px",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    newsection: {
      paddingTop: "20px",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "70%",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    tableCellHeader: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: "5px",
      fontWeight: "bold",
    },
    tableCell: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: "3px",
    },
    signSection: {
      display: "flex",
      flexDirection: "row",
      marginTop: "90px",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: "50px",
      textAlign: "center",
    },
    signContainer: {
      width: "20%",
      paddingTop: "5px",
      borderTop: "1px solid black",
    },
    signLabel: {
      marginTop: "10px",
    },
    logoImage: {
      marginBottom: "10px",
      width: "100%",
    },
    image: {
      width: 70,
      height: 70,
    },
  });

  const SchoolResultDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <Image style={styles.image} src="./logo.png" />
          <Texxt style={styles.heading}>Fountain University Postgraduate</Texxt>
          <View style={styles.rowsection}>
            <View style={styles.section}>
              <Texxt>Lecturer: {userData.name}</Texxt>
              <Texxt>Name: {selectedStudent.name}</Texxt>
              <Texxt>Matric No: {selectedStudent.matricno}</Texxt>
            </View>
            <View style={styles.section}>
              <Texxt>Sex: {selectedStudent.sex}</Texxt>
              <Texxt>Email: {selectedStudent.email}</Texxt>
              <Texxt>Department: {selectedStudent.department}</Texxt>
            </View>
          </View>

          <View style={styles.section}>
            <Texxt>Result Score: {resultData?.averageScore}</Texxt>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHeader}>
                <Texxt>Subject</Texxt>
              </View>
              <View style={styles.tableCellHeader}>
                <Texxt>Score</Texxt>
              </View>
              <View style={styles.tableCellHeader}>
                <Texxt>Units</Texxt>
              </View>
              <View style={styles.tableCellHeader}>
                <Texxt>Grade</Texxt>
              </View>
            </View>
            {resultData?.gradedCourses?.map((course, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Texxt>{course.courses}</Texxt>
                </View>
                <View style={styles.tableCell}>
                  <Texxt>{course.score}</Texxt>
                </View>
                <View style={styles.tableCell}>
                  <Texxt>{course.units}</Texxt>
                </View>
                <View style={styles.tableCell}>
                  <Texxt>{course.grade}</Texxt>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.newsection}>
            <Texxt>Result Status: {resultData?.status}</Texxt>
          </View>
          <View style={styles.signSection}>
            <View style={styles.signContainer}>
              <Texxt style={styles.signLabel}>HOD Signature and Date</Texxt>
            </View>
            <View style={styles.signContainer}>
              <Texxt style={styles.signLabel}>Dean Signature and Date</Texxt>
            </View>
            <View style={styles.signContainer}>
              <Texxt style={styles.signLabel}>VC Signature and Date</Texxt>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <SidebarWithHeader>
      <Flex bg="white" w="full" p="2" direction="column">
        {userRole === "Lecturer" ? (
          <>
            <Heading fontSize="lg" px="2" py="6" textAlign="center">
              STUDENTS RESULTS{" "}
            </Heading>
            <HStack w="full" alignItems="start" overflowX="scroll">
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
                              <Th>Units</Th>
                              <Th>ATT</Th>
                              <Th>CA</Th>
                              <Th>Exams</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedStudent?.coursesAdded?.map(
                              (course, index) => (
                                <>
                                  <Tr
                                    key={index}
                                    cursor="pointer"
                                    w="full"
                                    justifyContent="space-between"
                                  >
                                    <Td>{course.name}</Td>
                                    <Td>{course.units}</Td>
                                    <Td>
                                      <Input
                                        type="text"
                                        value={
                                          courseData[index].attendance > 0
                                            ? courseData[index].attendance
                                            : course.attendance
                                        }
                                        min={0}
                                        px="1"
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
                                        px="1"
                                        value={
                                          courseData[index].ca > 0
                                            ? courseData[index].ca
                                            : course.ca
                                        }
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
                                        px="1"
                                        value={
                                          courseData[index].exams > 0
                                            ? courseData[index].exams
                                            : course.exams
                                        }
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
                        <HStack w="full" py="5" justifyContent="space-between">
                          <Button
                            my={4}
                            colorScheme="green"
                            onClick={handleSaveChanges}
                          >
                            Save Changes
                          </Button>

                          <Button
                            my={4}
                            display={isDisplay === true ? "unset" : "none"}
                            colorScheme="green"
                          >
                            {isClient && (
                              <PDFDownloadLink
                                document={<SchoolResultDocument />}
                                fileName={`${selectedStudent.matricno}'s Result.pdf`}
                              >
                                Download Reuslt
                              </PDFDownloadLink>
                            )}
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
