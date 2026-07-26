import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting Big Data Seed...');

    const defaultPassword = await bcrypt.hash('password123', env.BCRYPT_SALT_ROUNDS);
    const adminPassword = await bcrypt.hash('admin123', env.BCRYPT_SALT_ROUNDS);

    // 1. Seed Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rentnest.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@rentnest.com',
            password: adminPassword,
            role: 'admin',
            status: 'active',
            phone: '+8801700000000',
        },
    });
    console.log('✅ Admin user ready:', admin.email);

    // 2. Seed Landlords
    const landlordsData = [
        { name: 'Rahim Chowdhury', email: 'rahim@rentnest.com', phone: '+8801711111111' },
        { name: 'Fatema Begum', email: 'fatema@rentnest.com', phone: '+8801722222222' },
        { name: 'Tanvir Hossain', email: 'tanvir@rentnest.com', phone: '+8801733333333' },
        { name: 'Nusrat Jahan', email: 'nusrat@rentnest.com', phone: '+8801744444444' },
    ];

    const landlords = [];
    for (const l of landlordsData) {
        const landlord = await prisma.user.upsert({
            where: { email: l.email },
            update: {},
            create: {
                ...l,
                password: defaultPassword,
                role: 'landlord',
                status: 'active',
            },
        });
        landlords.push(landlord);
    }
    console.log(`✅ ${landlords.length} Landlords ready`);

    // 3. Seed Tenants
    const tenantsData = [
        { name: 'Aarif Ahmed', email: 'aarif@gmail.com', phone: '+8801811111111' },
        { name: 'Sumiya Akter', email: 'sumiya@gmail.com', phone: '+8801822222222' },
        { name: 'Kamal Pasha', email: 'kamal@gmail.com', phone: '+8801833333333' },
    ];

    const tenants = [];
    for (const t of tenantsData) {
        const tenant = await prisma.user.upsert({
            where: { email: t.email },
            update: {},
            create: {
                ...t,
                password: defaultPassword,
                role: 'tenant',
                status: 'active',
            },
        });
        tenants.push(tenant);
    }
    console.log(`✅ ${tenants.length} Tenants ready`);

    // 4. Seed Categories
    const categoriesData = [
        { name: 'Apartment', description: 'Modern apartment units with all urban facilities' },
        { name: 'House', description: 'Spacious single & multi-family independent houses' },
        { name: 'Studio', description: 'Cozy and efficient studio apartments for solo living' },
        { name: 'Villa', description: 'Luxury duplex and triplex villas with private gardens' },
        { name: 'Condo', description: 'High-end condominium units in prime gated towers' },
    ];

    const categoriesMap: Record<string, string> = {};
    for (const cat of categoriesData) {
        const createdCat = await prisma.category.upsert({
            where: { name: cat.name },
            update: { description: cat.description },
            create: cat,
        });
        categoriesMap[cat.name] = createdCat.id;
    }
    console.log('✅ 5 Categories ready');

    // 5. Seed 22 Properties
    const propertiesData = [
        {
            title: 'Luxury 3BHK Apartment in Gulshan 2',
            description: 'Spacious 2200 sqft apartment featuring Lake View, Italian Marble flooring, full central AC, and 24/7 high security.',
            location: 'Gulshan 2, Dhaka',
            price: 1200,
            bedrooms: 3,
            bathrooms: 3,
            area: 2200,
            amenities: ['Elevator', 'Parking', 'Generator', 'Security', 'AC', 'Balcony'],
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
            categoryName: 'Apartment',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Modern Executive Studio Near AIUB',
            description: 'Fully furnished studio apartment equipped with high-speed WiFi, smart TV, kitchen appliances, and study desk.',
            location: 'Kuril, Dhaka',
            price: 350,
            bedrooms: 1,
            bathrooms: 1,
            area: 550,
            amenities: ['WiFi', 'Furnished', 'AC', 'Elevator', 'Security'],
            images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9'],
            categoryName: 'Studio',
            landlordIdx: 1,
            status: 'available',
        },
        {
            title: 'Duplex Family House with Garden',
            description: 'Beautiful 4 bedroom duplex house with open rooftop, private lawn, garage, and rooftop terrace.',
            location: 'Sector 4, Uttara, Dhaka',
            price: 1800,
            bedrooms: 4,
            bathrooms: 4,
            area: 3200,
            amenities: ['Garden', 'Garage', 'Rooftop Access', 'Generator', 'Security'],
            images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
            categoryName: 'House',
            landlordIdx: 2,
            status: 'available',
        },
        {
            title: 'Premium Lakefront Villa',
            description: 'Exclusive luxury villa with private swimming pool, home theater room, servant quarters, and solar power setup.',
            location: 'Baridhara Diplomatic Zone, Dhaka',
            price: 4500,
            bedrooms: 5,
            bathrooms: 6,
            area: 6000,
            amenities: ['Swimming Pool', 'Private Garden', 'CCTV', 'Solar Power', 'Gym', 'Servant Room'],
            images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227'],
            categoryName: 'Villa',
            landlordIdx: 3,
            status: 'available',
        },
        {
            title: 'High-Rise Condo with Panoramic View',
            description: '3 bedroom luxury condo on the 18th floor offering stunning sky views, gym access, and underground car parking.',
            location: 'Banani, Dhaka',
            price: 1500,
            bedrooms: 3,
            bathrooms: 3,
            area: 2100,
            amenities: ['Gym', 'Swimming Pool', 'Underground Parking', '24/7 Security', 'Elevator'],
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
            categoryName: 'Condo',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Affordable 2BHK Flat for Families',
            description: 'Well-ventilated 2 bedroom apartment close to Metro station, schools, and shopping malls.',
            location: 'Mirpur 10, Dhaka',
            price: 400,
            bedrooms: 2,
            bathrooms: 2,
            area: 1100,
            amenities: ['Elevator', 'Gas Connection', 'Generator', 'Security'],
            images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb'],
            categoryName: 'Apartment',
            landlordIdx: 1,
            status: 'available',
        },
        {
            title: 'Cosy Single Studio Apartment',
            description: 'Compact studio ideal for single professionals or university students. Fully tiled with kitchenette.',
            location: 'Dhanmondi 27, Dhaka',
            price: 300,
            bedrooms: 1,
            bathrooms: 1,
            area: 450,
            amenities: ['Gas Line', 'Security', 'Balcony'],
            images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80'],
            categoryName: 'Studio',
            landlordIdx: 2,
            status: 'available',
        },
        {
            title: '3 Bedroom House with Courtyard',
            description: 'Traditional spacious family house with central courtyard, ample sunlight, and peaceful neighborhood.',
            location: 'Agrabad, Chittagong',
            price: 850,
            bedrooms: 3,
            bathrooms: 3,
            area: 2400,
            amenities: ['Garage', 'Courtyard', 'Water Pump', 'Security'],
            images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7'],
            categoryName: 'House',
            landlordIdx: 3,
            status: 'available',
        },
        {
            title: 'Luxury Sea-Facing Penthouse Condo',
            description: 'Top floor penthouse condo overlooking the Bay of Bengal with private deck and infinity pool access.',
            location: 'Marine Drive, Cox\'s Bazar',
            price: 2500,
            bedrooms: 4,
            bathrooms: 4,
            area: 3500,
            amenities: ['Sea View', 'Infinity Pool', 'Deck', 'Smart Lock', 'Valet Parking'],
            images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
            categoryName: 'Condo',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Modern Apartment Near Sylhet Shahjalal University',
            description: 'Newly constructed 3 BHK apartment with modern kitchen cabinets, wide balcony, and tea garden view.',
            location: 'Kumarpara, Sylhet',
            price: 500,
            bedrooms: 3,
            bathrooms: 2,
            area: 1450,
            amenities: ['Generator', 'Water Filter', 'Elevator', 'Security'],
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
            categoryName: 'Apartment',
            landlordIdx: 1,
            status: 'available',
        },
        {
            title: '3BHK Flat near Dhanmondi Lake',
            description: 'East-facing bright apartment opposite Dhanmondi Lake walk track. Quiet residential lane.',
            location: 'Dhanmondi 8, Dhaka',
            price: 950,
            bedrooms: 3,
            bathrooms: 3,
            area: 1850,
            amenities: ['Lake View', 'Elevator', 'Intercom', 'Parking', 'Generator'],
            images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6'],
            categoryName: 'Apartment',
            landlordIdx: 2,
            status: 'available',
        },
        {
            title: 'Compact Studio Flat in Bashundhara R/A',
            description: 'Gated community studio with full surveillance, close to NSU, IUB, and Evercare Hospital.',
            location: 'Block C, Bashundhara R/A, Dhaka',
            price: 380,
            bedrooms: 1,
            bathrooms: 1,
            area: 500,
            amenities: ['Gated Security', 'WiFi', 'Elevator', 'Gym'],
            images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb'],
            categoryName: 'Studio',
            landlordIdx: 3,
            status: 'available',
        },
        {
            title: '4 Bedroom Colonial Heritage Villa',
            description: 'Restored colonial style villa surrounded by lush greenery, wide veranda, and private driveway.',
            location: 'Nasirabad, Chittagong',
            price: 2200,
            bedrooms: 4,
            bathrooms: 4,
            area: 4000,
            amenities: ['Lawn', 'Veranda', 'Garage', 'Servant Quarter'],
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
            categoryName: 'Villa',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Corner Unit Luxury Condo in Lalmatia',
            description: 'Corner apartment with 3 side open views, high-end wooden flooring, and modular open kitchen.',
            location: 'Lalmatia, Dhaka',
            price: 1100,
            bedrooms: 3,
            bathrooms: 3,
            area: 1950,
            amenities: ['Open Kitchen', 'Corner Unit', 'Elevator', 'Security', 'Parking'],
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
            categoryName: 'Condo',
            landlordIdx: 1,
            status: 'available',
        },
        {
            title: '2BHK Apartment in Uttara Sector 11',
            description: 'Freshly painted 2 bedroom flat with servant bathroom, near Sector 11 park and lake.',
            location: 'Sector 11, Uttara, Dhaka',
            price: 600,
            bedrooms: 2,
            bathrooms: 2,
            area: 1250,
            amenities: ['Park Nearby', 'Elevator', 'CCTV', 'Gas Line'],
            images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f'],
            categoryName: 'Apartment',
            landlordIdx: 2,
            status: 'available',
        },
        {
            title: 'Spacious Independent House with Rooftop',
            description: 'Full independent 2-story building suitable for commercial office or large family residence.',
            location: 'Khulshi, Chittagong',
            price: 1600,
            bedrooms: 4,
            bathrooms: 4,
            area: 3000,
            amenities: ['Rooftop', 'Parking (3 cars)', 'Commercial Allowed', 'Water Reservoir'],
            images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'],
            categoryName: 'House',
            landlordIdx: 3,
            status: 'available',
        },
        {
            title: 'Furnished Bachelor Studio Flat',
            description: 'All-inclusive studio flat with bed, wardrobe, fridge, microwave, and air conditioner.',
            location: 'Mohakhali DOHS, Dhaka',
            price: 420,
            bedrooms: 1,
            bathrooms: 1,
            area: 600,
            amenities: ['Fully Furnished', 'AC', 'Fridge', 'DOHS Security'],
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'],
            categoryName: 'Studio',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Garden Duplex Villa in Zindabazar',
            description: 'Serene duplex house surrounded by tea gardens and fruit trees. Fully secluded private campus.',
            location: 'Zindabazar, Sylhet',
            price: 1400,
            bedrooms: 3,
            bathrooms: 3,
            area: 2800,
            amenities: ['Fruit Garden', 'Private Boundary Wall', 'Generator', 'Garage'],
            images: ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b'],
            categoryName: 'Villa',
            landlordIdx: 1,
            status: 'available',
        },
        {
            title: '3BHK Modern Flat in Shantinagar',
            description: 'Convenient location close to Motijheel commercial area. High floor with good ventilation.',
            location: 'Shantinagar, Dhaka',
            price: 750,
            bedrooms: 3,
            bathrooms: 3,
            area: 1600,
            amenities: ['Elevator', 'Intercom', '24/7 Water', 'Generator'],
            images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d'],
            categoryName: 'Apartment',
            landlordIdx: 2,
            status: 'available',
        },
        {
            title: 'Luxury 3BHK Condo near Jamuna Future Park',
            description: 'Located in modern gated complex with swimming pool, gym, badminton court, and supermarket on ground floor.',
            location: 'Bashundhara Gate, Dhaka',
            price: 1300,
            bedrooms: 3,
            bathrooms: 3,
            area: 2000,
            amenities: ['Supermarket Onsite', 'Badminton Court', 'Pool', 'Gym', 'Parking'],
            images: ['https://images.unsplash.com/photo-1512915922686-57c11dde9b6b'],
            categoryName: 'Condo',
            landlordIdx: 3,
            status: 'available',
        },
        {
            title: 'Triplex Villa with Rooftop Jacuzzi',
            description: 'Ultra-luxurious triplex villa featuring private rooftop Jacuzzi, sauna room, and smart home automation.',
            location: 'Gulshan 1, Dhaka',
            price: 5000,
            bedrooms: 5,
            bathrooms: 6,
            area: 6500,
            amenities: ['Jacuzzi', 'Sauna', 'Smart Home', 'Private Lift', '3 Car Parking'],
            images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'],
            categoryName: 'Villa',
            landlordIdx: 0,
            status: 'available',
        },
        {
            title: 'Economical 2BHK Flat in Halishahar',
            description: 'Spacious 2 bedroom apartment near port access road. Clean and quiet residential environment.',
            location: 'Halishahar, Chittagong',
            price: 350,
            bedrooms: 2,
            bathrooms: 2,
            area: 1000,
            amenities: ['Balcony', 'Gas Cylinder Space', 'Water Supply'],
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
            categoryName: 'Apartment',
            landlordIdx: 1,
            status: 'available',
        },
    ];

    const createdProperties = [];
    for (const p of propertiesData) {
        const categoryId = categoriesMap[p.categoryName];
        const landlord = landlords[p.landlordIdx];

        const property = await prisma.property.create({
            data: {
                title: p.title,
                description: p.description,
                location: p.location,
                price: p.price,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                area: p.area,
                amenities: p.amenities,
                images: p.images,
                status: p.status,
                categoryId: categoryId,
                landlordId: landlord.id,
            },
        });
        createdProperties.push(property);
    }
    console.log(`✅ ${createdProperties.length} Properties seeded across various locations & categories!`);

    // 6. Seed Sample Rental Requests & Reviews
    const sampleProperty = createdProperties[0];
    const sampleTenant = tenants[0];

    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId: sampleTenant.id,
            propertyId: sampleProperty.id,
            status: 'completed',
            moveInDate: new Date('2026-08-01'),
            message: 'I am very interested in renting this Gulshan apartment for 1 year.',
            landlordNote: 'Welcome! Application approved.',
        },
    });

    await prisma.payment.create({
        data: {
            rentalRequestId: rentalRequest.id,
            amount: sampleProperty.price,
            provider: 'stripe',
            userId: sampleTenant.id,
            status: 'completed',
            transactionId: 'tx_seed_stripe_999',
            providerPaymentId: 'pi_seed_stripe_999',
            paidAt: new Date(),
        },
    });

    await prisma.review.create({
        data: {
            tenantId: sampleTenant.id,
            propertyId: sampleProperty.id,
            rating: 5,
            comment: 'Outstanding apartment! Very peaceful, modern amenities and friendly landlord.',
        },
    });

    console.log('✅ Sample Rental Request, Payment & Review created');
    console.log('\n🎉 BIG DATA SEED COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------');
    console.log('Credentials Summary:');
    console.log('Admin    : admin@rentnest.com / admin123');
    console.log('Landlord : rahim@rentnest.com / password123');
    console.log('Tenant   : aarif@gmail.com / password123');
    console.log('--------------------------------------------');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });