import { Injectable, ExecutionContext } from '@nestjs/common';
//Reflector is a helper class used to read custom metadata attached to controllers or route handlers via decorators
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  //ExecutionContext provides details about the current request execution pipeline.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * reflector.getAllAndOverride(): Looks at both the method and the controller metadata.
     * If both exist, the method-level metadata overrides the controller-level metadata
     * (perfect for features like allowing a specific route to be @Public() inside an otherwise restricted controller).
     */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      //Returns a reference to the specific method (handler) inside that controller that will be executed
      context.getHandler(),
      //Returns the Type of the Controller class that is about to handle the current request.
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
