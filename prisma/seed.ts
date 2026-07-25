import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await bcrypt.hash('admin123', env.BCRYPT_SALT_ROUNDS);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rentnest.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@rentnest.com',
            password: adminPassword,
            role: 'admin',
            status: 'active',
        },
    });
    console.log('Admin user created:', admin.email);

    const categories = [
        { name: 'Apartment', description: 'Modern apartment units' },
        { name: 'House', description: 'Single-family homes' },
        { name: 'Studio', description: 'Studio apartments' },
        { name: 'Villa', description: 'Luxury villas' },
        { name: 'Condo', description: 'Condominium units' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }
    console.log('Categories seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });