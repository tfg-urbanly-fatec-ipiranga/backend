import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Pipe that throws a BadRequestException if the request body is absent or empty.
 *
 * Use it via the @RequiredBody() decorator (recommended) or directly:
 *   @Body(new RequiredBodyPipe())
 */
@Injectable()
export class RequiredBodyPipe implements PipeTransform {
  transform(value: unknown) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'object' && Object.keys(value as object).length === 0)
    ) {
      throw new BadRequestException('Request body must not be empty.');
    }
    return value;
  }
}
