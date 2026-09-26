import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, C, Card, Header } from "../../components/UI";
import { Subject, SubjectModule, useApp } from "../../context/AppContext";

type ReadingModule = {
  id?: string;
  title: string;
  summary: string;
  content: string[];
};

const modulesBySubject: Record<string, ReadingModule[]> = {
  "Information Assurance": [
    { title: "The CIA Triad", summary: "Confidentiality, integrity, and availability", content: ["Information assurance protects information and the systems that use it. The CIA triad is a simple framework for describing three core security goals.", "Confidentiality limits information to authorized people. Access permissions and encryption help protect it.", "Integrity keeps information accurate and complete. Validation, change controls, and audit logs help detect improper changes.", "Availability keeps systems and information usable when needed. Backups, maintenance, and recovery plans reduce downtime.", "When choosing a control, consider which of these goals it supports and what trade-offs it introduces."] },
    { title: "Risk Assessment", summary: "Identify threats, weaknesses, likelihood, and impact", content: ["Risk assessment helps an organization decide which security problems deserve attention first.", "Start by identifying an information asset, a threat that could affect it, and any vulnerability that makes the threat more likely to succeed.", "Estimate likelihood and impact using consistent scales. A simple risk rating can be calculated by combining the two estimates, but the assumptions should always be recorded.", "Choose a response: reduce the risk with controls, avoid the activity, transfer part of the impact, or accept the remaining risk. Reassess when systems or threats change."] },
    { title: "Access Control", summary: "Give people only the access needed for their work", content: ["Access control determines who can use a resource and what actions they may perform.", "Authentication verifies an identity; authorization decides what that identity is allowed to do. Strong passwords and multi-factor authentication support authentication, while roles and permissions support authorization.", "The principle of least privilege grants only the access required for a task and removes it when it is no longer needed.", "Review access regularly, protect administrator accounts, and keep records of important access changes."] },
    { title: "Incident Response", summary: "Prepare for, contain, and learn from security incidents", content: ["An incident response plan gives people clear steps to follow when a security event occurs.", "Preparation includes assigning responsibilities, keeping contact details current, and maintaining backups. During an incident, confirm what happened, contain affected systems, and preserve useful evidence.", "After recovery, document the timeline and decisions. A review should identify practical improvements to controls, communication, and the response plan."] },
  ],
  "Software Engineering": [
    { title: "Requirements and User Stories", summary: "Describe needs before deciding how to build them", content: ["Requirements explain what a system must do and the constraints it must satisfy.", "A user story describes a need from a user's perspective. Acceptance criteria make the expected behavior specific enough to verify.", "Good requirements are clear, testable, and prioritized. Confirm them with stakeholders before implementation, and record changes so the team understands their impact."] },
    { title: "Software Design", summary: "Break a system into understandable components", content: ["Software design turns requirements into structures that developers can implement and maintain.", "Separate responsibilities so each component has a clear purpose. Keep dependencies explicit, and prefer simple interfaces between components.", "Consider reliability, security, performance, and accessibility as design constraints rather than late-stage additions. Document decisions when they affect future work."] },
    { title: "Testing Fundamentals", summary: "Find defects at several levels", content: ["Testing checks whether software behaves as intended and helps reveal defects before release.", "Unit tests check small pieces of logic. Integration tests check collaboration between components. End-to-end tests exercise complete user workflows.", "Tests should assert observable behavior, cover important edge cases, and be repeatable. Automated tests complement review and exploratory testing; they do not replace them."] },
    { title: "Version Control and Collaboration", summary: "Track changes and work safely as a team", content: ["Version control records how a project changes over time and makes it possible to review or recover earlier work.", "Keep changes focused, write useful commit messages, and use branches or pull requests to review work before it is merged.", "Resolve conflicts deliberately and run the relevant tests after integrating changes. A clear history makes collaboration and debugging easier."] },
  ],
  "Database Systems": [
    { title: "Relational Data Modeling", summary: "Represent entities and their relationships", content: ["A relational database stores information in tables made of rows and columns. A row represents one record, and a column represents one attribute.", "A primary key uniquely identifies a row. A foreign key refers to a key in another table and expresses a relationship.", "Identify entities and their relationships before creating tables. Use constraints to protect data quality and choose column types that match the values being stored."] },
    { title: "Normalization", summary: "Reduce duplication and update anomalies", content: ["Normalization organizes relational data so facts are stored consistently.", "First normal form uses values that are atomic for the chosen design. Second normal form removes partial dependencies on part of a composite key. Third normal form removes dependencies on non-key attributes.", "Normalization can reduce duplicate data and prevent inconsistent updates. Denormalization may be considered for measured performance needs, but it should be intentional."] },
    { title: "SQL Queries and Joins", summary: "Retrieve related records from tables", content: ["SQL is used to define, query, and modify relational data. SELECT retrieves rows, WHERE filters them, and ORDER BY sorts the result.", "A join combines rows using a relationship between tables. INNER JOIN returns matching rows; LEFT JOIN retains every row from the left table and includes matches when they exist.", "Use explicit join conditions and select only the columns needed. Test queries with cases that have missing or duplicate related records."] },
    { title: "Transactions and Data Integrity", summary: "Keep related changes consistent", content: ["A transaction groups database operations into one logical unit of work.", "ACID describes common transaction properties: atomicity, consistency, isolation, and durability. Together they help prevent partially applied or conflicting updates.", "Use constraints and transactions to protect important rules. Understand isolation behavior when several users may update related data at the same time."] },
  ],
  "Web Development": [
    { title: "How the Web Works", summary: "Understand browsers, servers, requests, and responses", content: ["A browser requests a resource from a server using HTTP. The server responds with a status, headers, and often a body such as HTML, CSS, JavaScript, or data.", "URLs identify resources. DNS helps resolve a domain name to a network address, and HTTPS protects communication in transit using encryption and server identity checks.", "Browser developer tools can inspect requests, responses, console messages, and page layout when debugging a web application."] },
    { title: "HTML and Semantic Structure", summary: "Describe the meaning and hierarchy of page content", content: ["HTML provides the structure of a web page. Semantic elements communicate the purpose of content to browsers, assistive technology, and developers.", "Use headings in a logical hierarchy, buttons for actions, and links for navigation. Associate form labels with their controls and provide useful alternative text for meaningful images.", "A semantic structure improves accessibility and makes pages easier to maintain."] },
    { title: "CSS Layout and Responsive Design", summary: "Create layouts that adapt to different screens", content: ["CSS controls presentation and layout. Flexbox arranges items along one dimension, while Grid is useful for layouts with rows and columns.", "Responsive design adapts content to the available viewport. Use flexible sizing, readable line lengths, and breakpoints only when the layout needs them.", "Test at narrow and wide sizes. Ensure controls remain usable, text stays readable, and content does not overflow horizontally."] },
    { title: "JavaScript and Browser Events", summary: "Add behavior to interactive pages", content: ["JavaScript lets a page respond to events such as clicks, form submissions, and network results.", "Keep state changes predictable and validate user input near the boundary where it enters the application. Handle asynchronous work and failures explicitly.", "Use browser APIs deliberately, and avoid manipulating the document in ways that conflict with the framework rendering the interface."] },
  ],
};

export default function SubjectDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { subjects, subjectModules, notes, currentUser, addSubjectModule, updateSubjectModule, deleteSubjectModule } = useApp();
  const [selectedModule, setSelectedModule] = useState<ReadingModule | null>(null);
  const [moduleEditorVisible, setModuleEditorVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<SubjectModule | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleSummary, setModuleSummary] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const subject = subjects.find((item) => item.id === id);
  const subjectNotes = subject ? notes.filter((note) => note.subject === subject.name && note.userId === currentUser?.id) : [];
  const modules = subject ? [
    ...getModules(subject),
    ...subjectModules.filter((module) => module.subjectId === subject.id && module.userId === currentUser?.id).map((module) => ({ id: module.id, title: module.title, summary: module.summary, content: module.content.split(/\n\s*\n/).filter(Boolean) })),
  ] : [];
  const subjectSubtitle = subject ? [subject.instructor, subject.schedule].filter(Boolean).join(" • ") || "Personal subject" : undefined;

  const openModuleEditor = (module?: SubjectModule) => {
    setEditingModule(module ?? null);
    setModuleTitle(module?.title ?? "");
    setModuleSummary(module?.summary ?? "");
    setModuleContent(module?.content ?? "");
    setModuleEditorVisible(true);
  };

  const saveModule = () => {
    if (!subject || !moduleTitle.trim() || !moduleContent.trim()) {
      Alert.alert("Missing information", "Enter a module title and reading content.");
      return;
    }
    const moduleData = { subjectId: subject.id, title: moduleTitle.trim(), summary: moduleSummary.trim(), content: moduleContent.trim() };
    if (editingModule) updateSubjectModule(editingModule.id, moduleData);
    else addSubjectModule(moduleData);
    setModuleEditorVisible(false);
  };

  if (!subject) {
    return <View style={s.screen}><Header title="Subject" onBack={() => router.replace("/(student)/subjects")}/><Text style={s.message}>Subject not found.</Text></View>;
  }

  if (selectedModule) {
    return <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Header title={selectedModule.title} subtitle={subject.name} onBack={() => setSelectedModule(null)}/>
      <Card style={s.reading}>
        {selectedModule.content.map((paragraph, index) => <Text key={index} style={s.paragraph}>{paragraph}</Text>)}
      </Card>
    </ScrollView>;
  }

  return <>
  <ScrollView style={s.screen} contentContainerStyle={s.content}>
    <Header title={subject.name} subtitle={subjectSubtitle} onBack={() => router.replace("/(student)/subjects")}/>
    <View style={s.location}><Ionicons name="location-outline" size={16} color={C.muted}/><Text style={s.locationText}>{subject.room}</Text></View>
    <View style={s.sectionHeading}>
      <Text style={s.sectionTitle}>Modules to Read</Text>
      <View style={s.moduleActions}><Text style={s.moduleCount}>{modules.length} modules</Text><TouchableOpacity style={s.addModule} onPress={() => openModuleEditor()} accessibilityRole="button" accessibilityLabel="Add reading module"><Ionicons name="add" size={17} color="#fff"/><Text style={s.addPointerText}>Add</Text></TouchableOpacity></View>
    </View>
    {modules.length ? modules.map((module, index) => <View key={module.id ?? module.title} style={s.moduleRow}>
      <TouchableOpacity style={s.moduleOpen} onPress={() => setSelectedModule(module)} accessibilityRole="button">
        <Card style={s.moduleCard}>
          <View style={s.moduleNumber}><Text style={s.moduleNumberText}>{String(index + 1).padStart(2, "0")}</Text></View>
          <View style={s.moduleInfo}>
            <Text style={s.moduleTitle}>{module.title}</Text>
            <Text style={s.moduleSummary}>{module.summary}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted2}/>
        </Card>
      </TouchableOpacity>
      {module.id&&<View style={s.moduleTools}><TouchableOpacity onPress={()=>openModuleEditor(subjectModules.find(item=>item.id===module.id))} accessibilityRole="button" accessibilityLabel={`Edit ${module.title}`}><Ionicons name="create-outline" size={18} color={C.blue}/></TouchableOpacity><TouchableOpacity onPress={()=>Alert.alert("Delete Module","Remove this reading module?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>deleteSubjectModule(module.id!)}])} accessibilityRole="button" accessibilityLabel={`Delete ${module.title}`}><Ionicons name="trash-outline" size={18} color={C.red}/></TouchableOpacity></View>}
    </View>) : <Text style={s.message}>No reading modules yet. Add a module to build your exam review list.</Text>}
    <View style={s.sectionHeading}>
      <Text style={s.sectionTitle}>Exam Pointers</Text>
      <TouchableOpacity style={s.addPointer} onPress={() => router.push({ pathname: "/(student)/note-form", params: { mode: "add", subject: subject.name, title: "Exam Pointers" } })} accessibilityRole="button" accessibilityLabel="Add exam pointer">
        <Ionicons name="add" size={18} color="#fff"/>
        <Text style={s.addPointerText}>Add</Text>
      </TouchableOpacity>
    </View>
    {subjectNotes.length ? subjectNotes.map((note) => <TouchableOpacity key={note.id} onPress={() => router.push({ pathname: "/(student)/note-form", params: { mode: "edit", id: note.id } })} accessibilityRole="button">
      <Card style={s.pointerCard}>
        <Text style={s.moduleTitle}>{note.title}</Text>
        <Text style={s.moduleSummary}>{note.content}</Text>
        <Text style={s.pointerUpdated}>Updated {note.updatedAt}</Text>
      </Card>
    </TouchableOpacity>) : <Text style={s.message}>Add your review topics and reminders here before the exam.</Text>}
  </ScrollView>
  <Modal visible={moduleEditorVisible} transparent animationType="slide" onRequestClose={()=>setModuleEditorVisible(false)}>
    <View style={s.modalBackdrop}><ScrollView keyboardShouldPersistTaps="handled" style={s.moduleModal} contentContainerStyle={s.modalContent}>
      <Header title={editingModule?"Edit Module":"Add Reading Module"} onBack={()=>setModuleEditorVisible(false)}/>
      <Text style={s.inputLabel}>Module Title</Text><TextInput value={moduleTitle} onChangeText={setModuleTitle} style={s.input} placeholder="Chapter or topic" placeholderTextColor={C.muted2}/>
      <Text style={s.inputLabel}>Short Summary (optional)</Text><TextInput value={moduleSummary} onChangeText={setModuleSummary} style={s.input} placeholder="What this module covers" placeholderTextColor={C.muted2}/>
      <Text style={s.inputLabel}>Reading Content</Text><TextInput value={moduleContent} onChangeText={setModuleContent} multiline textAlignVertical="top" style={[s.input,s.contentInput]} placeholder="Write your study material here..." placeholderTextColor={C.muted2}/>
      <Button title={editingModule?"SAVE MODULE":"ADD MODULE"} onPress={saveModule}/>
    </ScrollView></View>
  </Modal>
  </>;
}

function getModules(subject: Subject) {
  return modulesBySubject[subject.name] || [];
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 36 },
  location: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  locationText: { color: C.muted, fontSize: 12 },
  sectionHeading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 26, marginBottom: 12 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "800" },
  moduleCount: { color: C.muted, fontSize: 11 },
  moduleCard: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  moduleNumber: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.card2, alignItems: "center", justifyContent: "center" },
  moduleNumberText: { color: C.blue, fontSize: 12, fontWeight: "800" },
  moduleInfo: { flex: 1 },
  moduleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  moduleOpen: { flex: 1 },
  moduleTools: { flexDirection: "row", gap: 12, paddingHorizontal: 5 },
  moduleTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
  moduleSummary: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  moduleActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  addModule: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8, backgroundColor: C.blue },
  addPointer: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: C.blue },
  addPointerText: { color: C.text, fontSize: 11, fontWeight: "800" },
  pointerCard: { marginBottom: 9 },
  pointerUpdated: { color: C.muted2, fontSize: 10, marginTop: 8 },
  modalBackdrop: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.65)", padding: 18 },
  moduleModal: { maxHeight: "90%", backgroundColor: C.bg, borderRadius: 14, borderWidth: 1, borderColor: C.border },
  modalContent: { padding: 18 },
  inputLabel: { color: C.muted, fontWeight: "700", fontSize: 12, marginBottom: 7, marginTop: 12 },
  input: { minHeight: 46, borderRadius: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, color: C.text, paddingHorizontal: 12 },
  contentInput: { minHeight: 180, paddingTop: 12, marginBottom: 18 },
  reading: { marginTop: 8 },
  paragraph: { color: C.text, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  message: { color: C.muted, textAlign: "center", marginTop: 32, lineHeight: 20 },
});