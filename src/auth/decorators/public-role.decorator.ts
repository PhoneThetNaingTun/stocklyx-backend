import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROLE_KEY = 'isPublicRole';

export const PublicRole = () => SetMetadata(IS_PUBLIC_ROLE_KEY, true);
