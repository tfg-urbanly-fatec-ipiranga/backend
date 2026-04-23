import { Controller, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./auth.dto";
import { Public } from "./public.decorator";
import { Roles } from "./roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("Auth")
@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Registrar novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário registrado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  register(@RequiredBody() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Autenticar usuário" })
  @ApiResponse({ status: 201, description: "Login realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  login(@RequiredBody() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @Patch("change-password")
  @ApiOperation({ summary: "Alterar senha do usuário" })
  @ApiResponse({ status: 200, description: "Senha alterada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  changePassword(@RequiredBody() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
