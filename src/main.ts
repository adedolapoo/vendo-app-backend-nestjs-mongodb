import { NestFactory } from '@nestjs/core';
import { CoreModule } from '@vendor-app/core/core.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import useSwaggerUIAuthStoragePlugin from './swagger_plugin';
import { HttpExceptionFilter } from '@vendor-app/core/exceptions/http-exception.filter';
import SentryInterceptor from '@vendor-app/core/interceptor/sentry.interceptor';
import * as Sentry from '@sentry/node';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  Sentry.init({
    dsn: process.env.SENTRY_URL,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Vendor App')
    .setDescription('Vendor Products App')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('1.0')
    .addTag('VendorApp')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.enableCors();

  await app.listen(port);
}
bootstrap();
