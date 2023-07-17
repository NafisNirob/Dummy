import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoEntity } from './seller/seller.entity';

@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '4480',
      database: 'tri_gardening',
      autoLoadEntities: true,
      synchronize: true,
      entities: [PhotoEntity],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
