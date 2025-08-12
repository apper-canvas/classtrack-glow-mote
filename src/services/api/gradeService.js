import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

export const gradeService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...grades];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    grades[index] = {
      ...grades[index],
      ...gradeData
    };
    return { ...grades[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    grades.splice(index, 1);
    return true;
  }
};