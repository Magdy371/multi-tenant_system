import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/common/database/drizzle.service';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { authConfig } from '../../../config/auth.config';
import { eq, and, sql } from 'drizzle-orm';
import {
  users,
  refreshTokens,
  userSessions,
} from '../../../common/database/schema';
