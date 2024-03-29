import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as config from 'config';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Salary Manager');
  const serverConfig = config.get('server');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: '*' });
  }

  app.useStaticAssets(join(__dirname, '../../../public'));
  global.console.log('environment', process.env.NODE_ENV);

  const options = new DocumentBuilder()
    .setTitle('Salary Manager')
    .setDescription('Salary Manager')
    .setVersion('1.0')
    .addTag('Salary Manager')
    .setSchemes('http', 'https')
    .addBearerAuth('Authorization', 'header', 'apiKey')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: false },
    }),
  );

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application Listening on Port ${port} `);
  logger.log(`Api documentation avaliable at "/doc/`);
}

bootstrap();
