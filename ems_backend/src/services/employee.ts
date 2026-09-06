import { Prisma } from "@prisma/client";
import prismaClient from "../prismaClient";

class EmployeeService {
  async addEmployee(data: Prisma.EmployeeCreateInput) {
    return prismaClient.employee.create({
      data: data
    });
  }

  async getAllEmployee() {
    return prismaClient.employee.findMany();
  }

  async getOneEmployee(id: number) {
    return prismaClient.employee.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async updateEmployee(id: number, data: Prisma.EmployeeUpdateInput) {
    return prismaClient.employee.update({
      where:{
        id: Number(id)
      },
      data: data
    })
  }

  async deleteEmployee(id: Number) {
    return prismaClient.employee.delete({
      where: {
        id: Number(id)
      }
    })
  }
}

export default new EmployeeService()