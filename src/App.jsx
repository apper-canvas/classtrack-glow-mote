import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import StudentDetail from "@/components/pages/StudentDetail";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import Classes from "@/components/pages/Classes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="grades" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="classes" element={<Classes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;