import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { UsersModule } from "../modules/users/users.module";
import { RoleModule } from "src/modules/roles/roles.module";
import {PermissionsModule} from "../modules/permissions/permissions.module";

export function setupSwagger(app: INestApplication) {
  const theme = new SwaggerTheme();

  const config = new DocumentBuilder()
    .setTitle("Tenant-System API")
    .setDescription("tenant-system Backend API Documentation")
    .setVersion("2.0.0")
    .addTag("Users", "User management endpoints")
    .addTag("Roles", "Roles management endPoints")
    .addTag("Permissions", "Permissions management endPoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT-auth",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [UsersModule, RoleModule, PermissionsModule],
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Define public endpoints that should not require authentication
  const publicEndpoints = ["/users", "/roles", "/permissions"];

  // Add global security to all endpoints except public ones
  Object.keys(document.paths).forEach((path) => {
    const pathItem = document.paths[path];
    if (pathItem) {
      Object.keys(pathItem).forEach((method) => {
        const operation = (pathItem as any)[method];

        // Skip if already has security defined or if it's a public endpoint
        if (
          operation &&
          operation.security === undefined &&
          !publicEndpoints.includes(path)
        ) {
          operation.security = [{ "JWT-auth": [] }];
        }
      });
    }
  });

  SwaggerModule.setup("api/docs", app, document, {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
