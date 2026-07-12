// ─── Auth Service ───────────────────────────────────────────────────────────
import userRepository from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
  /**
   * Register a new user — always creates as Employee role
   */
  async register(input: RegisterInput) {
    const { email, password, username } = input;

    // Check if user already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    // Get Employee role
    const employeeRole = await userRepository.getRoleByName('Employee');
    if (!employeeRole) {
      throw new AppError('System error: Employee role not found', 500);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      name: username,
      email,
      password: hashedPassword,
      role: { connect: { id: employeeRole.id } },
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    });

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Login with email and password
   */
  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check status
    if (user.status === 'INACTIVE') {
      throw new AppError('Account has been deactivated. Contact administrator.', 403);
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Refresh token rotation
   */
  async refreshTokens(currentRefreshToken: string) {
    // Verify the refresh token
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(currentRefreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    // Find user by refresh token
    const user = await userRepository.findByRefreshToken(currentRefreshToken);
    if (!user) {
      // Token reuse detected — invalidate all tokens for this user
      await userRepository.updateRefreshToken(payload.userId, null);
      throw new AppError('Refresh token has been revoked', 401);
    }

    // Generate new tokens
    const newPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    // Rotate refresh token
    await userRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout — clear refresh token
   */
  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: any) {
    const { password, refreshToken, ...safe } = user;
    return {
      id: safe.id,
      name: safe.name,
      email: safe.email,
      username: safe.name, // Frontend compatibility
      avatar: safe.avatar,
      status: safe.status,
      is_active: safe.status === 'ACTIVE',
      role: safe.role?.name || 'Employee',
      department: safe.department?.name || null,
      departmentId: safe.departmentId,
      created_at: safe.createdAt,
      createdAt: safe.createdAt,
      updatedAt: safe.updatedAt,
    };
  }
}

export default new AuthService();
