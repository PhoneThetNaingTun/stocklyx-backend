import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessJwtAuthGuard } from './auth/guards';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    CompanyModule,
    StoreModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessJwtAuthGuard }],
})
export class AppModule {}
