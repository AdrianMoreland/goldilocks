import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { UserRole } from './generated/enums';

const prisma = new PrismaService(new ConfigService());

/**
 * One-off provisioning script for a single staff account. This is a closed
 * internal tool (no public self-registration), so users are created here
 * rather than through a signup flow: this creates the Supabase Auth identity
 * (if it doesn't already exist) and a matching Prisma `User` row with the
 * SAME id, which is what AuthService looks up on every login/token check
 * (see auth.service.ts's loadActiveUser).
 *
 * The account comes from the environment so no credential is ever committed:
 *   PROVISION_EMAIL, PROVISION_PASSWORD, PROVISION_FIRST_NAME, PROVISION_LAST_NAME
 *   PROVISION_ROLE (ADMIN | MANAGER | SALES | ACCOUNTING | AUDITOR, default SALES)
 *   PROVISION_ADMIN=true (optional, grants the admin flag)
 * An existing account keeps its password; change it from the admin console.
 *
 * Uses the service-role key (admin API) - this script must only ever run
 * from a trusted machine/CI, never shipped to the client.
 */

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`Missing ${name}. See the comment at the top of provision-users.ts.`);
        process.exit(1);
    }
    return value;
}

const role = (process.env.PROVISION_ROLE ?? 'SALES') as UserRole;
if (!Object.values(UserRole).includes(role)) {
    console.error(`PROVISION_ROLE must be one of: ${Object.values(UserRole).join(', ')}`);
    process.exit(1);
}

const seed = {
    email: required('PROVISION_EMAIL'),
    password: required('PROVISION_PASSWORD'),
    firstName: required('PROVISION_FIRST_NAME'),
    lastName: required('PROVISION_LAST_NAME'),
    role,
    admin: process.env.PROVISION_ADMIN === 'true',
};
type SeedUser = typeof seed;

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function findExistingSupabaseUser(email: string) {
    const perPage = 200;
    for (let page = 1; ; page++) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
        if (error) throw error;

        const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (found) return found;

        if (data.users.length < perPage) return null;
    }
}

async function findOrCreateSupabaseUser(seed: SeedUser) {
    const { data, error } = await supabase.auth.admin.createUser({
        email: seed.email,
        password: seed.password,
        email_confirm: true,
    });

    if (!error) return data.user;

    const existing = await findExistingSupabaseUser(seed.email);
    if (!existing) throw error;

    // Never touch an existing account's password: re-running must not reset a live credential.
    return existing;
}

async function main() {
    const authUser = await findOrCreateSupabaseUser(seed);

    await prisma.user.upsert({
        where: { id: authUser.id },
        update: {
            email: seed.email,
            firstName: seed.firstName,
            lastName: seed.lastName,
            role: seed.role,
            admin: seed.admin,
            isActive: true,
        },
        create: {
            id: authUser.id,
            email: seed.email,
            firstName: seed.firstName,
            lastName: seed.lastName,
            password: '', // Supabase Auth owns the real credential
            role: seed.role,
            admin: seed.admin,
            isActive: true,
        },
    });

    console.log(`✅ ${seed.email} - role=${seed.role} admin=${seed.admin} (id ${authUser.id})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
