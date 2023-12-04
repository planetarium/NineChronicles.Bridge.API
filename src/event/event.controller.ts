import { Controller, Get } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }

  @Get(':id')
  getEvent(id: string) {
    return this.eventService.getEvent(id);
  }
}
