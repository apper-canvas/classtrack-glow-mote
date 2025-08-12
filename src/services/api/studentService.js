import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

export const studentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = students.find(s => s.Id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    students[index] = {
      ...students[index],
      ...studentData,
      updatedAt: new Date().toISOString()
    };
    return { ...students[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    students.splice(index, 1);
    return true;
  }
};