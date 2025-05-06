import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MongooseModule.forRoot(
      process.env.DB_URI || 'mongodb://localhost:27017/default-db',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
