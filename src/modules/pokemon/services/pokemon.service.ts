import { PaginationDto } from '@core/dtos/pagination.dto';
import { EnvVariables } from '@core/enum/env.enums';
import { TranslatedTypes } from '@core/enum/translated-types';
import { IPokemon, IPokemonById, TypeElement } from '@core/interface/pokemon.interface';
import { ENV_NOT_SET } from '@core/messages/messages';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);
  constructor(
    private readonly httpService: HttpService
  ) { }

  /**
   * Fetches a list of Pokemons with pagination
   *
   * @param pagination The pagination options
   * @returns A Promise that resolves with the fetched Pokemons
   * @throws BadRequestException if the request fails
   */
  async findAll(pagination: PaginationDto): Promise<IPokemon[]> {

    this.checkEnvVariables([EnvVariables.POKE_API_BASE_URL, EnvVariables.POKE_API_GET_ALL]);

    const { POKE_API_BASE_URL, POKE_API_GET_ALL } = process.env

    const { data } = await lastValueFrom(
      this.httpService.get(`${POKE_API_BASE_URL}${POKE_API_GET_ALL}`,
        {
          params: {
            limit: pagination.limit,
            offset: pagination.offset
          }
        }
      ).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new BadRequestException(error);
        })
      )
    );

    return data
  }


  /**
   * Fetches a Pokemon by its id
   *
   * @param id The id of the Pokemon
   * @param translated Whether to fetch the translated names of the types
   * @returns A Promise that resolves with the fetched Pokemon
   * @throws BadRequestException if the request fails
   */
  async findOneById(id: string, translated: boolean = false): Promise<IPokemonById> {

    this.checkEnvVariables([EnvVariables.POKE_API_BASE_URL, EnvVariables.POKE_API_GET_ALL]);

    const { POKE_API_BASE_URL, POKE_API_GET_ALL } = process.env

    const { data } = await lastValueFrom(
      this.httpService.get(`${POKE_API_BASE_URL}${POKE_API_GET_ALL}/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new BadRequestException(error.message);
        })
      )
    );

    if (translated) {
      const translatedTypes = await Promise.all(
        data.types.map((type) =>
          this.getTranslatedTypes(type.type.url, type.slot)
        )
      );

      return {
        name: data.name,
        types: translatedTypes,
      };
    }

    else {
      const cleanResponse = {
        name: data.name,
        types: data.types
      }
      return cleanResponse
    }

  }


  /**
   * Fetches the translated names of a Pokemon type from the PokeAPI, given the URL of the type.
   *
   * @param typeUrl The URL of the type to fetch the translated names for.
   * @param slot The slot of the type in the Pokemon's type array.
   * @returns A Promise that resolves with the translated type object.
   * @throws BadRequestException if the request fails.
   */
  async getTranslatedTypes(typeUrl: string, slot: number): Promise<TypeElement> {
    const { data } = await lastValueFrom(
      this.httpService.get(typeUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new BadRequestException(error.message);
        })
      )
    );

    // Filtrar los nombres en español, japonés e inglés
    const names = data.names.filter(n =>
      n.language.name === TranslatedTypes.ES ||
      n.language.name === TranslatedTypes.JA ||
      n.language.name === TranslatedTypes.EN
    );

    // Crear el objeto con los nombres de los tipos
    const translatedType = {
      slot: slot,
      type: {
        name: data.name,
        url: data.url,
        names: names.map(nameObj => ({
          language: {
            name: nameObj.language.name,
            url: nameObj.language.url,
          },
          name: nameObj.name,
        })),
      },
    };

    return translatedType;
  }





  /**
   * Verifies that all given environment variables are set. If a variable is not set, it logs an error
   * for the variable and throws a `DOMException` with the `ENV_NOT_SET` message.
   *
   * @param variables The environment variables to check.
   */
  private checkEnvVariables(variables: string[]): void {
    for (const variable of variables) {
      if (!process.env[variable]) {
        this.logger.error(variable);
        this.logger.error(ENV_NOT_SET);
        throw new DOMException(ENV_NOT_SET);
      }
    }
  }
}
