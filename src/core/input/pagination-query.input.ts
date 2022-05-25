import { ApiProperty } from '@nestjs/swagger';

/**
 * Input data for pagination.
 *
 */
export default class PaginationQuery {
  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  offset?: number;
}
