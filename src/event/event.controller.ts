import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    const event = await this.eventService.getEvent(id);
    if (event === null) {
      throw new NotFoundException();
    }

    return event;
  }
}
