import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The event corresponds to the given request tx id.',
    type: Event,
    isArray: true,
  })
  getEvents() {
    return this.eventService.getEvents();
  }

  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'There is no event corresponds to the given request tx id.',
  })
  @ApiOkResponse({
    description: 'The event corresponds to the given request tx id.',
    type: Event,
  })
  async getEvent(@Param('id') id: string) {
    const event = await this.eventService.getEvent(id);
    if (event === null) {
      throw new NotFoundException();
    }

    return event;
  }
}
