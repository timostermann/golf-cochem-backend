import type { MiddlewareConsumer } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MailController } from "./mail/mail.controller";
import { MailModule } from "./mail/mail.module";
import { CsrfMiddleware } from "./middleware/csrf.middleware";
import { SecurityHeadersMiddleware } from "./middleware/security-headers.middleware";

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [AppController, MailController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes("*");
    consumer.apply(SecurityHeadersMiddleware).forRoutes("*");
  }
}
