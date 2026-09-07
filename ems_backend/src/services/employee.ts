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

  async deleteEmployee(id: number) {
    try {
      return await prismaClient.employee.delete({
        where: {
          id: Number(id)
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return null;
        }
      }
      throw error;
    }
  }
}

export default new EmployeeService()