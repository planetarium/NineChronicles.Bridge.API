import {
  RequestCategory,
  RequestType,
  ResponseType,
  TxResult,
} from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ResponseTransaction {
  @ApiProperty({ description: 'The network id of the response transaction.' })
  networkId: string;

  @ApiProperty({ description: "The response transaction's id." })
  id: string;

  @ApiProperty({ description: "The response transaction's nonce." })
  nonce: number;

  @ApiProperty({
    description:
      "The response transaction's raw data which presented as hexadecimal string.",
  })
  raw: string;

  @ApiProperty({
    description: "The response transaction's action type.",
    enum: ResponseType,
  })
  type: ResponseType;

  @ApiProperty({
    description: "The response transaction's transaction result.",
    enum: TxResult,
  })
  lastStatus: TxResult;

  @ApiProperty({
    description:
      "The datetime when the response transaction's transaction result updated.",
    enum: TxResult,
  })
  @Type(() => Date)
  statusUpdatedAt: Date;

  @ApiProperty({
    description:
      'The id of the request transaction that created the response transaction.',
  })
  requestTransactionId: string;
}

export class Event {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: "The request transaction's category",
    enum: RequestCategory,
  })
  category: RequestCategory;

  @ApiProperty({
    description: "The request transaction's type",
    enum: RequestType,
  })
  type: RequestType;

  @ApiProperty({
    description:
      'The network id of the block where the request transaction is included.',
  })
  networkId: string;

  @ApiProperty({
    description: 'The block index where the request transaction is included.',
  })
  blockIndex: number;

  @ApiProperty({
    description: 'The address who requested this event.',
  })
  sender: string;

  @ApiProperty({
    description: 'The datetime when this event is recorded in the database.',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'The response transactions.',
    type: ResponseTransaction,
    isArray: true,
  })
  @Type(() => ResponseTransaction)
  responses: ResponseTransaction[];
}
