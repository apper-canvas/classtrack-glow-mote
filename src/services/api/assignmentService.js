import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

export const assignmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...assignments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    assignments[index] = {
      ...assignments[index],
      ...assignmentData
    };
    return { ...assignments[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    assignments.splice(index, 1);
    return true;
  }
};