import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { RESPONSE_MESSAGES } from 'src/shared/utils/messages';

@Controller('api/examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  async create(@Body() payload: any) {
    const example = await this.exampleService.create(payload);

    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      data: example,
    };
  }

  @Get()
  async findAll() {
    const examples = await this.exampleService.findAll();

    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      data: examples,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const example = await this.exampleService.findOne(+id);

    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      data: example,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: any) {
    const example = await this.exampleService.update(+id, payload);

    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      data: example,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const example = await this.exampleService.remove(+id);

    return {
      message: RESPONSE_MESSAGES.SUCCESS,
      data: example,
    };
  }
}
