// ─── Auth Controller ────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { sendSuccess } from '../utils/response';
import env from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);

      // Set refresh token cookie
      res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, {
        access_token: result.accessToken,
        token_type: 'bearer',
        user: result.user,
      }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);

      // Set refresh token cookie
      res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, {
        access_token: result.accessToken,
        token_type: 'bearer',
        user: result.user,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body?.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not provided',
        });
      }

      const result = await authService.refreshTokens(refreshToken);

      // Rotate cookie
      res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, {
        access_token: result.accessToken,
        token_type: 'bearer',
      }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await authService.logout(req.user.id);
      }

      res.clearCookie('refresh_token', { path: '/' });
      res.clearCookie('access_token', { path: '/' });

      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
      }

      const profile = await authService.getProfile(req.user.id);
      sendSuccess(res, profile, 'Profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // In production, this would send an email with a reset link
      // For now, just acknowledge the request
      sendSuccess(res, null, 'If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Placeholder for password reset logic
      sendSuccess(res, null, 'Password reset successful. Please login with your new password.');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
