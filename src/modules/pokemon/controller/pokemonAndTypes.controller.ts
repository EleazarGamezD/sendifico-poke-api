import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Pokemon')
@Controller('pokemonAndTypes')
export class PokemonAndTypesController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'get Pokemon by id' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOneById(
    @Param('id') id: string
  ) {
    return this.pokemonService.findOneById(id, true);
  }
}
