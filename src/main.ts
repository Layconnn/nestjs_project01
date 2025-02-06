import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import https from 'https';
import * as cron from 'node-cron'; // Changed from default import to namespace import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

// Keep the app active on Render by pinging it every 5 minutes
function keepAlive(url: string): void {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// Replace with your actual Render URL
const urlToPing = process.env.DEPLOYED_URL || '';

// Schedule a ping every 5 minutes using cron
cron.schedule('*/5 * * * *', () => {
  keepAlive(urlToPing);
  console.log('Pinging the server every 5 minutes');
});
