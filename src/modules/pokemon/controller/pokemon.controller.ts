import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { PaginationDto } from '@core/dtos/pagination.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'get All Pokemon' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(
    @Query() pagination: PaginationDto
  ) {
    return this.pokemonService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'get Pokemon by id' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOneById(
    @Param('id') id: string
  ) {
    return this.pokemonService.findOneById(id);
  }
}
