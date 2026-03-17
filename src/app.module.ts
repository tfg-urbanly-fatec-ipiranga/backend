import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PrismaService } from "./prisma/prisma.service";
import { PlacesModule } from "./places/places.module";
import { CloudinaryService } from "./common/services/cloudinary/cloudinary.service";
import { TagsModule } from "./tags/tags.module";
import { CategoriesModule } from "./categories/categories.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { PlacePhotosModule } from "./place-photos/place-photos.module";

@Module({
  imports: [
    UsersModule,
    PlacesModule,
    TagsModule,
    CategoriesModule,
    ReviewsModule,
    FavoritesModule,
    PlacePhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CloudinaryService],
})
export class AppModule {}
