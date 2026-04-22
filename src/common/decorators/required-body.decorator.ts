import { Body } from '@nestjs/common';
import { RequiredBodyPipe } from '../pipes/required-body.pipe';

/**
 * Drop-in replacement for @Body() that additionally rejects empty bodies.
 *
 * @example
 * @Post()
 * create(@RequiredBody() body: CreatePlaceDto) { ... }
 *
 * @example — with a specific key
 * @Put(':id')
 * update(@RequiredBody('name') name: string) { ... }
 */
export const RequiredBody = (property?: string) =>
  property
    ? Body(property, new RequiredBodyPipe())
    : Body(new RequiredBodyPipe());
