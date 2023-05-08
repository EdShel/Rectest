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
};
export default ProjectRepository;

interface GameProjectCreateData {
  name: string;
  apiKey: string;
}
