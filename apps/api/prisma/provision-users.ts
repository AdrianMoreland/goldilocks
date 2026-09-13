import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../src/lib/db/prisma';
import { UserRole } from './generated/enums';

/**
 * One-off provisioning script for this app's two known staff accounts.
 * This is a closed internal tool (no public self-registration), so users
 * are created here rather than through a signup flow: this creates the
 * Supabase Auth identity (if it doesn't already exist) and a matching
 * Prisma `User` row with the SAME id, which is what AuthService looks up
 * on every login/token check (see auth.service.ts's loadActiveUser).
 *
 * Uses the service-role key (admin API) — this script must only ever run
 * from a trusted machine/CI, never shipped to the client.
 */

interface SeedUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    admin: boolean;
}

const USERS: SeedUser[] = [
    {
        email: 'moreland.madhome@gmail.com',
        password: '1234!',
        firstName: 'Moreland',
        lastName: 'Madhome',
        role: UserRole.SALES,
        admin: false,
    },
    {
        email: 'adrian.moreland.fernandez@gmail.com',
        password: '1234!',
        firstName: 'Adrian',
        lastName: 'Moreland Fernandez',
        role: UserRole.ADMIN,
        admin: true,
    },
];

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

    // Keep the password in sync with what's configured here — harmless if unchanged.
    await supabase.auth.admin.updateUserById(existing.id, { password: seed.password });
    return existing;
}

async function main() {
    for (const seed of USERS) {
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

        console.log(`✅ ${seed.email} — role=${seed.role} admin=${seed.admin} (id ${authUser.id})`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
