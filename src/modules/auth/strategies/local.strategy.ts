import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DrizzleService } from '../../../common/database/drizzle.service';
import {
  CaslAbilityFactory,
  ScopeType,
} from '../../../common/casl/casl-ability.factory';
import { UserWithRoles } from '../../../common/casl/interface/user-with-roles.interface';
