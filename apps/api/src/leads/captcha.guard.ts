import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = process.env.CAPTCHA_SECRET_KEY;
    if (!secret) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.body?.captchaToken;
    if (!token) return false;
    try {
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token }),
      });
      const data = (await res.json()) as { success?: boolean };
      return !!data.success;
    } catch {
      return false;
    }
  }
}
