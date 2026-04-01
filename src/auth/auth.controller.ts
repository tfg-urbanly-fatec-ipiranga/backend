import { Body, Controller, Patch, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./auth.dto";
import { Public } from "./public.decorator";

@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Patch("change-password")
  changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
