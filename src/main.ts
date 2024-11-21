import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './Logging/logging.interceptor';
import { LoggingService } from './Logging/logging.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggingService()));
  const yamlDocument = YAML.load('./doc/api.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(yamlDocument));

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
