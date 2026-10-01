import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Opts a controller or handler out of the global JwtAuthGuard. Everything else requires a signed-in user. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
