import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const origins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:3001,http://localhost:3000,http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const port = config.get<number>('PORT', 4000)
  await app.listen(port)
}

void bootstrap()
