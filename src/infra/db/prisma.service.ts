import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { PrismaClient } from 'prisma/clients/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params: any, next: (params: any) => any) => {
      const isDeleteOne = params.action === 'delete';
      const isDeleteMany = params.action === 'deleteMany';

      if (isDeleteOne) {
        params.action = 'update';
        params.args.data = { ...params.args.data, deletedAt: new Date() };
      }

      if (isDeleteMany) {
        params.action = 'updateMany';
        params.args.data = { ...params.args.data, deletedAt: new Date() };
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
