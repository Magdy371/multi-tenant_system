import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGurad implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    //check roleBinding for this master admin
    const roleBindings: Array<{ role: { name: string }; scopeType: string }> =
      user.roleBindings || [];
    const isAdmin = roleBindings.some((rb) => rb.role?.name === 'MASTER_ADMIN');
    if (!isAdmin) throw new ForbiddenException('Admin access required');
    return true;
  }
}
