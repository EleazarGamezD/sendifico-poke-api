import { Module } from '@nestjs/common';
import { PokemonModule } from '@modules/pokemon/pokemon.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@core/config/configuration';
import { EnvEnum } from '@core/enum/env.enums';
import { LoggerModule } from 'nestjs-pino';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvEnum.ENV_FILE,
      load: [configuration],
      isGlobal: true
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,

          }
        }
      }
    }),
    PokemonModule],
})
export class AppModule { }
