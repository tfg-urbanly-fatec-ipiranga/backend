import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    role: true,
    avatar: true,
    birthDate: true,
    createdAt: true,
  };

  async register(data: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictException("E-mail already in use");
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new ConflictException("Username already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        birthDate: new Date(data.birthDate),
      },
      select: this.userSelect,
    });
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, role: user.role };
    const { password, ...userData } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const passwordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid current password");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully" };
  }
}
