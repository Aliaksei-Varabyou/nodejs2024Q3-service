import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './Logging/logging.interceptor';
import { LoggingService } from './Logging/logging.service';
import { HttpExceptionFilter } from './Logging/HttpExceptionFilter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = new LoggingService();
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));
  app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  const yamlDocument = YAML.load('./doc/api.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(yamlDocument));

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);

  process.on('uncaughtException', (error) => {
    loggingService.error(`Uncaught Exception: ${error.message}`);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled Rejection: ${reason}`);
  });
}
bootstrap();
