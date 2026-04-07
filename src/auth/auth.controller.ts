import { Controller, Patch, Post } from "@nestjs/common";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./auth.dto";
import { Public } from "./public.decorator";

@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@RequiredBody() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  login(@RequiredBody() body: LoginDto) {
    return this.authService.login(body);
  }

  @Patch("change-password")
  changePassword(@RequiredBody() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
