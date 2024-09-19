import { Module } from '@nestjs/common';
import { PokemonController } from './controller/pokemon.controller';
import { PokemonService } from './services/pokemon.service';
import { HttpModule } from '@nestjs/axios';
import { PokemonAndTypesController } from './controller/pokemonAndTypes.controller';



@Module({
  imports: [HttpModule],
  controllers: [PokemonController, PokemonAndTypesController],
  providers: [PokemonService],
})
export class PokemonModule { }
