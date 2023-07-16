import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

const schoolName = "Fountain University Postgraduate";
const studentName = "John Doe";
const email = "johndoe@example.com";
const lecturerName = "Bekjdlkmsldn";
const matricno = "FUO/19/0383";
const sex = "Male";
const dept = "MLS";
const totalResult = 85;
const courses = [
  { subject: "Math", score: 90, grade: "A" },
  { subject: "Science", score: 85, grade: "B" },
  { subject: "English", score: 80, grade: "B" },
  { subject: "History", score: 88, grade: "B+" },
  { subject: "Science", score: 85, grade: "B" },
  { subject: "English", score: 80, grade: "B" },
  { subject: "Math", score: 90, grade: "A" },
  { subject: "Science", score: 85, grade: "B" },
  { subject: "English", score: 80, grade: "B" },
  { subject: "Science", score: 85, grade: "B" },
  { subject: "English", score: 80, grade: "B" },
];
// const SchoolResultDocument = () => {
//     return(
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.content}>
//         <Image style={styles.image} src="./logo.png" />
//         <Text style={styles.heading}>{schoolName}</Text>
//         <View style={styles.rowsection}>
//           <View style={styles.section}>
//             <Text> Lecturer: {lecturerName}</Text>
//             <Text> Name: {studentName}</Text>
//             <Text>Matric No: {matricno}</Text>
//           </View>
//           <View style={styles.section}>
//             <Text>Sex: {sex}</Text>
//             <Text>Email: {email}</Text>
//             <Text>Department: {dept}</Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text>Total Result: {totalResult}</Text>
//         </View>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCellHeader}>
//               <Text>Subject</Text>
//             </View>
//             <View style={styles.tableCellHeader}>
//               <Text>Score</Text>
//             </View>
//             <View style={styles.tableCellHeader}>
//               <Text>Grade</Text>
//             </View>
//           </View>
//           {courses.map((course, index) => (
//             <View key={index} style={styles.tableRow}>
//               <View style={styles.tableCell}>
//                 <Text>{course.courses}</Text>
//               </View>
//               <View style={styles.tableCell}>
//                 <Text>{course.score}</Text>
//               </View>
//               <View style={styles.tableCell}>
//                 <Text>{course.units}</Text>
//               </View>
//               <View style={styles.tableCell}>
//                 <Text>{course.grade}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//         <View style={styles.signSection}>
//           <View style={styles.signContainer}>
//             <Text style={styles.signLabel}>HOD Signature and Date</Text>
//           </View>
//           <View style={styles.signContainer}>
//             <Text style={styles.signLabel}>Dean Signature and Date</Text>
//           </View>
//           <View style={styles.signContainer}>
//             <Text style={styles.signLabel}>VC Signature and Date</Text>
//           </View>
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

const SchoolResultDocument = (
//   schoolName,
//   studentName,
//   email,
//   lecturerName,
//   matricno,
//   sex,
//   dept,
//   totalResult,
//   courses
) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <Image style={styles.image} src="./logo.png" />
          <Text style={styles.heading}>{schoolName}</Text>
          <View style={styles.rowsection}>
            <View style={styles.section}>
              <Text> Lecturer: {lecturerName}</Text>
              <Text> Name: {studentName}</Text>
              <Text>Matric No: {matricno}</Text>
            </View>
            <View style={styles.section}>
              <Text>Sex: {sex}</Text>
              <Text>Email: {email}</Text>
              <Text>Department: {dept}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>Total Result: {totalResult}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHeader}>
                <Text>Subject</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text>Score</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text>Grade</Text>
              </View>
            </View>
            {courses?.map((course, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{course.courses}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{course.score}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{course.units}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{course.grade}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.signSection}>
            <View style={styles.signContainer}>
              <Text style={styles.signLabel}>HOD Signature and Date</Text>
            </View>
            <View style={styles.signContainer}>
              <Text style={styles.signLabel}>Dean Signature and Date</Text>
            </View>
            <View style={styles.signContainer}>
              <Text style={styles.signLabel}>VC Signature and Date</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default SchoolResultDocument;
