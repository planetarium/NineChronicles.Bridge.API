import { Injectable, Logger } from '@nestjs/common';
import { RequestTransaction, ResponseTransaction } from '@prisma/client';
import { Event } from './event.entity';
import { plainToClass } from 'class-transformer';
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

  async getEvents(): Promise<Event[]> {
    const resp = await this.prismaService.requestTransaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE,
      include: {
        executions: true,
      },
    });

    return resp.map(convert) as Event[];
  }

  async getEvent(requestTxId: string): Promise<Event | null> {
    return convert(
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

function convert(x: RequestTransactionWithExecutions): Event | null {
  if (x === null || x === undefined) {
    return x;
  }

  return plainToClass(Event, {
    ...x,
    blockIndex: Number(x.blockIndex), // JSON doesn't support bigint.
    executions: undefined,
    responses: x.executions.map(convertResponseTransaction),
  });
}

function convertResponseTransaction(x: ResponseTransaction) {
  return {
    ...x,
    raw: x.raw.toString('hex'),
    nonce: Number(x.nonce), // JSON doesn't support bigint.
  };
}
