import "server-only";

import ProjectAccessLevel from "./../ProjectAccessLevel";
import db from "@/utils/db";
import { cache } from "react";

const ProjectRepository = {
  list: cache(async (userId: string) => {
    return await db.gameProject.findMany({
      where: {
        gameProjectMembers: {
          some: {
            userId,
          },
        },
      },
    });
  }),
  async create(data: GameProjectCreateData, userId: string) {
    await db.gameProject.create({
      data: {
        name: data.name,
        apiKey: data.apiKey,
        gameProjectMembers: {
          create: {
            userId,
            accessLevel: ProjectAccessLevel.Admin,
          },
        },
      },
    });
  },
  findByApiKey: async (apiKey: string) => {
    return await db.gameProject.findUnique({
      where: { apiKey },
    });
  },
  findById: async (id: string) => {
    return await db.gameProject.findUnique({
      where: { id },
    });
  },
  updateName: async (id: string, newName: string) => {
    await db.gameProject.update({
      data: { name: newName },
      where: { id },
    });
  },
};
export default ProjectRepository;

interface GameProjectCreateData {
  name: string;
  apiKey: string;
}
