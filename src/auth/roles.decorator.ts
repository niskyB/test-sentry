import { SetMetadata } from '@nestjs/common';
import { Role } from '../core/models';

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
