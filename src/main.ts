import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const yamlDocument = YAML.load('./doc/api.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(yamlDocument));

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
