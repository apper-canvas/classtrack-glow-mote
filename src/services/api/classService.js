import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

export const classService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...classes];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classItem = classes.find(c => c.Id === id);
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const maxId = Math.max(...classes.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...classData,
      studentIds: classData.studentIds || []
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    classes[index] = {
      ...classes[index],
      ...classData
    };
    return { ...classes[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    classes.splice(index, 1);
    return true;
  }
};