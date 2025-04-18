import { Response, Request } from 'express';
import { hasPermission } from '../../utils/auth_utils';
import { BaseController } from '../../utils/base_controller';
import { TasksService } from './tasks_service';
import { UsersUtil } from '../users/users_controller';
import { ProjectsUtil } from '../projects/projects_controller';
import { permissionHandler } from '../../utils/permissionHandler';
import { CacheUtil } from '../../utils/cache_util';

export class TaskController extends BaseController {
  /**
   * Handles the addition of a new user.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  @permissionHandler()
  public async addHandler(req: Request, res: Response): Promise<void> {
    try {
      // Create an instance of the ProjectService
      const service = new TasksService();

      // Extract task data from the request body
      const task = req.body;

      //check if the provided project_id is valid
      const isValidProject = await ProjectsUtil.checkValidProjectIds([
        task.projectId,
      ]);
      if (!isValidProject) {
        // If userIds are invalid, send an error response
        res.status(400).json({
          statusCode: 400,
          status: 'error',
          message: 'Invalid project_id',
        });
        return;
      }

      // Check if the provided user_id is valid
      const isValidUser = await UsersUtil.checkValidUserIds([task.userId]);

      if (!isValidUser) {
        // If userIds are invalid, send an error response
        res.status(400).json({
          statusCode: 400,
          status: 'error',
          message: 'Invalid user_id',
        });
        return;
      }

      // If userIds are valid, create the user
      const createdTask = await service.create(task);
      res.status(201).json(createdTask);
    } catch (error) {
      // Handle errors and send an appropriate response
      console.error(`Error while addUser => ${error.message}`);
      res.status(500).json({
        statusCode: 500,
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  @permissionHandler()
  public async getAllHandler(req: Request, res: Response): Promise<void> {
    const service = new TasksService();
    const result = await service.findAll(req.query);
    res.status(result.statusCode).json(result);
  }

  // @permissionHandler()
  public async getOneHandler(req: Request, res: Response): Promise<void> {
    // const dataFromCache = await CacheUtil.get('Task', req.params.id);
    // if (dataFromCache) return res.status(200).json(dataFromCache) && undefined;
    const service = new TasksService();
    const result = await service.findOne(req.params.id);
    // console.log('result', result);
    // CacheUtil.set('Task', req.params.id, result);
    res.status(result.statusCode).json(result);
  }

  @permissionHandler()
  public async updateHandler(req: Request, res: Response): Promise<void> {
    const task = req.body;
    const service = new TasksService();
    const result = await service.update(req.params.id, task);
    res.status(result.statusCode).json(result);
  }
  @permissionHandler()
  public async deleteHandler(req: Request, res: Response): Promise<void> {
    const service = new TasksService();
    const result = await service.delete(req.params.id);
    res.status(result.statusCode).json(result);
  }
}
