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
  Stack,
  Spinner,
  VStack,
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
  const [firstPage, setfirstPage] = useState(false);
  const [secondPage, setSecondPage] = useState(false);
  const [thirdPage, setThirdPage] = useState(false);
  const [allUsersData, setAllUsersData] = useState();
  const [userData, setUserData] = useState();
  const [resultData, setResultData] = useState();
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setselectedIndex] = useState(0);
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
  const [isDisplay, setIsDisplay] = useState([false, false, false]);

  const [courseData, setCourseData] = useState();

  const handleStudentClick = (student) => {
    if (userData.canEditResult) {
      setSelectedStudent(student);
      const firstUpdatedData = student?.coursesAdded?.firstSemester?.map(
        (course) => ({
          ...course,
          attendance: course.attendance || "",
          ca: course.ca || "",
          exams: course.exams || "",
        })
      );
      const secondUpdatedData = student?.coursesAdded?.secondSemester?.map(
        (course) => ({
          ...course,
          attendance: course.attendance || "",
          ca: course.ca || "",
          exams: course.exams || "",
        })
      );
      const thirdUpdatedData = student?.coursesAdded?.thirdSemester?.map(
        (course) => ({
          ...course,
          attendance: course.attendance || "",
          ca: course.ca || "",
          exams: course.exams || "",
        })
      );
      isAllCoursesFilled(firstUpdatedData, 1);
      isAllCoursesFilled(secondUpdatedData, 2);
      isAllCoursesFilled(thirdUpdatedData, 3);
      setCourseData({ firstUpdatedData, secondUpdatedData, thirdUpdatedData });
    } else {
      toast({
        title: "You cannot edit students results",
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const showResultPages = (num) => {
    if (num === 1) {
      setfirstPage(true);
      setSecondPage(false);
      setThirdPage(false);
      calculateGrades(selectedStudent?.coursesAdded.firstSemester);
    } else if (num === 2) {
      setfirstPage(false);
      setSecondPage(true);
      setThirdPage(false);
      calculateGrades(selectedStudent?.coursesAdded.secondSemester);
    } else if (num === 3) {
      setfirstPage(false);
      setSecondPage(false);
      setThirdPage(true);
      calculateGrades(selectedStudent?.coursesAdded.thirdSemester);
    }
  };

  const handleInputChange = (num, index, field, value) => {
    let dataComponent;

    if (num === 1) {
      dataComponent = courseData.firstUpdatedData.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      );
    } else if (num === 2) {
      dataComponent = courseData.secondUpdatedData.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      );
    } else if (num === 3) {
      dataComponent = courseData.thirdUpdatedData.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      );
    }

    setCourseData((prevData) => ({
      ...prevData,
      firstUpdatedData: num === 1 ? dataComponent : prevData.firstUpdatedData,
      secondUpdatedData: num === 2 ? dataComponent : prevData.secondUpdatedData,
      thirdUpdatedData: num === 3 ? dataComponent : prevData.thirdUpdatedData,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      const updatedStudent = {
        ...selectedStudent,
        coursesAdded: courseData,
      };
      isAllCoursesFilled(courseData.firstUpdatedData, 1);
      isAllCoursesFilled(courseData.secondUpdatedData, 2);
      isAllCoursesFilled(courseData.thirdUpdatedData, 3);

      let matri = updatedStudent.email;

      const result = await axios.put(`/api/User/${matri}`, {
        coursesAdded: {
          firstSemester: courseData.firstUpdatedData,
          secondSemester: courseData.secondUpdatedData,
          thirdSemester: courseData.thirdUpdatedData,
        },
        resultReady: isDisplay,
      });
      if (result) {
        setRefetchData((prevValue) => !prevValue);
        toast({
          title: "Successfully updated results",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const isAllCoursesFilled = (courses, num) => {
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
    data = data?.every((value) => value === true);

    setIsDisplay((prevArray) => {
      const newArray = [...prevArray];
      newArray[num - 1] = data;
      return newArray;
    });
    if (data === true) {
      calculateGrades(
        courses ?? num === 1
          ? selectedStudent?.coursesAdded.firstSemester
          : num === 2
          ? selectedStudent?.coursesAdded.secondSemester
          : num === 3
          ? selectedStudent?.coursesAdded.thirdSemester
          : {}
      );
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

  const showResult = (num) => {
    if (num === 1) {
      setselectedIndex(num - 1);
      calculateGrades(userData?.coursesAdded.firstSemester);
    } else if (num === 2) {
      setselectedIndex(num - 1);
      calculateGrades(userData?.coursesAdded.secondSemester);
    } else if (num === 3) {
      setselectedIndex(num - 1);
      calculateGrades(userData?.coursesAdded.thirdSemester);
    }
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
    tableCellHeaderFirst: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: "5px",
      fontWeight: "bold",
    },
    tableCellHeader: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: "5px",
      fontWeight: "bold",
    },
    tableCellFirst: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: "3px",
    },
    tableCell: {
      width: "20%",
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
    boldText: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
      fontWeight: "bold",
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
              <Texxt>
                Name:{" "}
                {userRole === "Lecturer" ? selectedStudent.name : userData.name}
              </Texxt>
              <Texxt>
                Matric No:{" "}
                {userRole === "Lecturer"
                  ? selectedStudent.matricno
                  : userData.matricno}
              </Texxt>
            </View>
            <View style={styles.section}>
              <Texxt>
                Sex:{" "}
                {userRole === "Lecturer" ? selectedStudent.sex : userData.sex}
              </Texxt>
              <Texxt>
                Email:{" "}
                {userRole === "Lecturer"
                  ? selectedStudent.email
                  : userData.email}
              </Texxt>
              <Texxt>
                Department:{" "}
                {userRole === "Lecturer"
                  ? selectedStudent.department
                  : userData.department}
              </Texxt>
            </View>
          </View>

          <View style={styles.boldText}>
            <Texxt>Result Score: {resultData?.averageScore}</Texxt>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHeaderFirst}>
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
                <View style={styles.tableCellFirst}>
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
          {userRole === "Lecturer" && (
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
          )}
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
              STUDENTS RESULTS
            </Heading>
            <Stack
              w="full"
              alignItems="start"
              direction={{ base: "column", md: "column", lg: "row" }}
              overflowX="scroll"
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Box p={4} w={{ base: "full", lg: "50%" }}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>S/N</Th>
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
                        _hover={
                          selectedStudent?.name === student.name
                            ? { bg: "gray.600" }
                            : { bg: "gray.200" }
                        }
                        bg={
                          selectedStudent?.name === student.name
                            ? "green.500"
                            : "transparent"
                        }
                        color={
                          selectedStudent?.name === student.name
                            ? "white"
                            : "black"
                        }
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
                w={{ base: "full", md: "full", lg: "60%" }}
                borderLeft="2px"
                borderLeftColor={{ base: "transparent", lg: "gray.400" }}
                minH="70vh"
              >
                {selectedStudent ? (
                  <>
                    {selectedStudent.coursesAdded?.firstSemester.length > 0 ? (
                      <>
                        <HStack w="full" gap="3">
                          <Button
                            onClick={() => showResultPages(1)}
                            bg={firstPage === true ? "green.500" : "gray.200"}
                            color={firstPage === true ? "white" : "black"}
                            _hover={
                              firstPage === true
                                ? { bg: "gray.600" }
                                : { bg: "gray.400" }
                            }
                            fontSize={{ base: "14px", lg: "18px" }}
                          >
                            First Semester
                          </Button>
                          <Button
                            onClick={() => showResultPages(2)}
                            bg={secondPage === true ? "green.500" : "gray.200"}
                            color={secondPage === true ? "white" : "black"}
                            _hover={
                              secondPage === true
                                ? { bg: "gray.600" }
                                : { bg: "gray.400" }
                            }
                            fontSize={{ base: "14px", lg: "18px" }}
                          >
                            Second Semester
                          </Button>
                          <Button
                            onClick={() => showResultPages(3)}
                            bg={thirdPage === true ? "green.500" : "gray.200"}
                            color={thirdPage === true ? "white" : "black"}
                            _hover={
                              thirdPage === true
                                ? { bg: "gray.600" }
                                : { bg: "gray.400" }
                            }
                            fontSize={{ base: "14px", lg: "18px" }}
                          >
                            Third Semester
                          </Button>
                        </HStack>
                        {firstPage && (
                          <>
                            <Table variant="striped" colorScheme="gray" mt="5">
                              <Thead>
                                <Tr>
                                  <Th>Courses</Th>
                                  <Th>Units</Th>
                                  <Th>ATT</Th>
                                  <Th>CAT</Th>
                                  <Th>Exams</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {selectedStudent?.coursesAdded?.firstSemester?.map(
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
                                              courseData?.firstUpdatedData[
                                                index
                                              ].attendance > 0
                                                ? courseData?.firstUpdatedData[
                                                    index
                                                  ].attendance
                                                : course.attendance
                                            }
                                            min={0}
                                            px="1"
                                            max={10}
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                1,
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
                                              courseData?.firstUpdatedData[
                                                index
                                              ].ca > 0
                                                ? courseData?.firstUpdatedData[
                                                    index
                                                  ].ca
                                                : course.ca
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                1,
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
                                              courseData?.firstUpdatedData[
                                                index
                                              ].exams > 0
                                                ? courseData?.firstUpdatedData[
                                                    index
                                                  ].exams
                                                : course.exams
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                1,
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
                            <HStack
                              w="full"
                              py="5"
                              justifyContent="space-between"
                            >
                              <Button
                                my={4}
                                colorScheme="green"
                                onClick={handleSaveChanges}
                                isLoading={isLoading}
                              >
                                Save Changes
                              </Button>

                              <Button
                                my={4}
                                display={
                                  isDisplay[0] === true ? "unset" : "none"
                                }
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
                        )}
                        {secondPage && (
                          <>
                            <Table variant="striped" colorScheme="gray" mt="5">
                              <Thead>
                                <Tr>
                                  <Th>Courses</Th>
                                  <Th>Units</Th>
                                  <Th>ATT</Th>
                                  <Th>CAT</Th>
                                  <Th>Exams</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {selectedStudent?.coursesAdded?.secondSemester?.map(
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
                                              courseData?.secondUpdatedData[
                                                index
                                              ].attendance > 0
                                                ? courseData?.secondUpdatedData[
                                                    index
                                                  ].attendance
                                                : course.attendance
                                            }
                                            min={0}
                                            px="1"
                                            max={10}
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                2,
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
                                              courseData?.secondUpdatedData[
                                                index
                                              ].ca > 0
                                                ? courseData?.secondUpdatedData[
                                                    index
                                                  ].ca
                                                : course.ca
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                2,
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
                                              courseData?.secondUpdatedData[
                                                index
                                              ].exams > 0
                                                ? courseData?.secondUpdatedData[
                                                    index
                                                  ].exams
                                                : course.exams
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                2,
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
                            <HStack
                              w="full"
                              py="5"
                              justifyContent="space-between"
                            >
                              <Button
                                my={4}
                                colorScheme="green"
                                onClick={handleSaveChanges}
                                isLoading={isLoading}
                              >
                                Save Changes
                              </Button>

                              <Button
                                my={4}
                                display={
                                  isDisplay[1] === true ? "unset" : "none"
                                }
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
                        )}
                        {thirdPage && (
                          <>
                            <Table variant="striped" colorScheme="gray" mt="5">
                              <Thead>
                                <Tr>
                                  <Th>Courses</Th>
                                  <Th>Units</Th>
                                  <Th>ATT</Th>
                                  <Th>CAT</Th>
                                  <Th>Exams</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {selectedStudent?.coursesAdded?.thirdSemester?.map(
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
                                              courseData?.thirdUpdatedData[
                                                index
                                              ]?.attendance > 0
                                                ? courseData?.thirdUpdatedData[
                                                    index
                                                  ].attendance
                                                : course.attendance
                                            }
                                            min={0}
                                            px="1"
                                            max={10}
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                3,
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
                                              courseData?.thirdUpdatedData[
                                                index
                                              ]?.ca > 0
                                                ? courseData?.thirdUpdatedData[
                                                    index
                                                  ].ca
                                                : course.ca
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                3,
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
                                              courseData?.thirdUpdatedData[
                                                index
                                              ]?.exams > 0
                                                ? courseData?.thirdUpdatedData[
                                                    index
                                                  ].exams
                                                : course.exams
                                            }
                                            border="1px"
                                            onChange={(e) =>
                                              handleInputChange(
                                                3,
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
                            <HStack
                              w="full"
                              py="5"
                              justifyContent="space-between"
                            >
                              <Button
                                my={4}
                                colorScheme="green"
                                onClick={handleSaveChanges}
                                isLoading={isLoading}
                              >
                                Save Changes
                              </Button>

                              <Button
                                my={4}
                                display={
                                  isDisplay[2] === true ? "unset" : "none"
                                }
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
                        )}
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
            </Stack>
          </>
        ) : (
          <>
            {/* {userRole === "Student" && userData.resultReady[0] ? (
              <>
                <Button onClick={showResult}>First Semester</Button>
                {resultData && <SchoolResultDocument />}
                {resultData && (
                  <Button my={4} colorScheme="green">
                    {isClient && (
                      <PDFDownloadLink
                        document={<SchoolResultDocument />}
                        fileName={`${userData.matricno}'s Result.pdf`}
                      >
                        Download Reuslt
                      </PDFDownloadLink>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <>
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
              </>
            )} */}

            {userRole === "Student" ? (
              userData.resultReady.length > 0 ? (
                userData.resultReady.map((isResultReady, index) => (
                  <div key={index}>
                    {isResultReady ? (
                      <>
                        <Button
                          onClick={() => showResult(index + 1)}
                          mt="5"
                          w="full"
                        >
                          {`Semester ${index + 1}`}
                        </Button>
                        {resultData && index === selectedIndex && (
                          <SchoolResultDocument />
                        )}
                        {resultData && index === selectedIndex && isClient && (
                          <Button my={4} colorScheme="green">
                            <PDFDownloadLink
                              document={<SchoolResultDocument />}
                              fileName={`Semester ${index + 1} ${
                                userData.matricno
                              }'s Result.pdf`}
                            >
                              Download Result
                            </PDFDownloadLink>
                          </Button>
                        )}
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
                        Results for Semester {index + 1} are currently
                        unavailable
                      </Flex>
                    )}
                  </div>
                ))
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
              )
            ) : (
              <Flex
                bg="white"
                w="full"
                px="32"
                mt="28"
                alignItems="center"
                justifyContent="center"
              >
                <Spinner />
              </Flex>
            )}
          </>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default HomePage;
