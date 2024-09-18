import { Module } from '@nestjs/common';
import { PokemonModule } from '@modules/pokemon/pokemon.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@core/config/configuration';
import { EnvEnum } from '@core/enum/env.enums';



@Module({
  imports: [    
    ConfigModule.forRoot({
      envFilePath: EnvEnum.ENV_FILE,
      load: [configuration],
      isGlobal: true
    }),
    PokemonModule],
})
export class AppModule {}
