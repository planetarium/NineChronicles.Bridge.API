import { Injectable, Logger } from '@nestjs/common';
import { RequestTransaction, ResponseTransaction } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const PAGE = 50;

type RequestTransactionWithExecutions =
  | (RequestTransaction & {
      executions: ResponseTransaction[];
    })
  | null;

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getEvents() {
    const resp = await this.prismaService.requestTransaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE,
      include: {
        executions: true,
      },
    });

    return resp.map(renameExecutions);
  }

  async getEvent(requestTxId: string) {
    return renameExecutions(
      await this.prismaService.requestTransaction.findUnique({
        where: {
          id: requestTxId,
        },
        include: {
          executions: true,
        },
      }),
    );
  }
}

function renameExecutions(x: RequestTransactionWithExecutions) {
  if (x === null || x === undefined) {
    return x;
  }

  return {
    ...x,
    executions: undefined,
    responses: x.executions,
  };
}
