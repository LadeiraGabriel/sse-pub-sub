import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3333;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: 'GET,HEAD',
    credentials: false,
  });

  await app.listen(port, () => console.log('Server is running!'));
}
bootstrap();
