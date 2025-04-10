import { Response, Request } from 'express';
import { hasPermission } from '../../utils/auth_utils';
import { ProjectsService } from './projects_service';
import { UsersUtil } from '../users/users_controller';
import { BaseController } from '../../utils/base_controller';
import { error } from 'console';
import { permissionHandler } from '../../utils/permissionHandler';
import { HandleErrors } from 'utils/error_handler';

export class ProjectController extends BaseController {
  /**
   * Handles the addition of a new user.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  @permissionHandler()
  public async addHandler(req: Request, res: Response): Promise<void> {
    const service = new ProjectsService();
    const project = req.body;
    const isValidUsers = await UsersUtil.checkValidUserIds(project.userIds);
    if (!isValidUsers) {
      res.status(400).json({
        statusCode: 400,
        status: 'error',
        message: 'Invalid userIds',
      });
      return;
    }

    // If userIds are valid, create the user
    const createdProject = await service.create(project);
    res.status(createdProject.statusCode).json(createdProject);
  }

  @permissionHandler()
  public async getAllHandler(req: Request, res: Response): Promise<void> {
    const service = new ProjectsService();
    const result = await service.findAll(req.query);
    for (const project of result.data) {
      project['users'] = await UsersUtil.getUsernamesById(project.userIds);
      delete project.userIds;
    }

    res.status(result.statusCode).json(result);
  }
  @permissionHandler()
  public async getOneHandler(req: Request, res: Response): Promise<void> {
    const service = new ProjectsService();
    const result = await service.findOne(req.params.id);
    result.data['users'] = await UsersUtil.getUsernamesById(
      result.data.userIds,
    );
    delete result.data.userIds;
    res.status(result.statusCode).json(result);
  }

  @permissionHandler()
  public async updateHandler(req: Request, res: Response): Promise<void> {
    const project = req.body;
    const service = new ProjectsService();
    const result = await service.update(req.params.id, project);
    res.status(result.statusCode).json(result);
  }

  @permissionHandler()
  public async deleteHandler(req: Request, res: Response): Promise<void> {
    const service = new ProjectsService();
    const result = await service.delete(req.params.id);
    res.status(result.statusCode).json(result);
  }
}

export class ProjectsUtil {
  public static async checkValidProjectIds(project_ids: string[]) {
    const projectService = new ProjectsService();

    // Query the database to check if all project_ids are valid
    const projects = await projectService.findByIds(project_ids);

    // Check if all project_ids are found in the database
    return projects.data.length === project_ids.length;
  }
}
