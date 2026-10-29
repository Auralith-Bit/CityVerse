require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

const categories = [
  { name: 'Urban', slug: 'urban', description: 'Cities, landmarks and city life' },
  { name: 'Religious', slug: 'religious', description: 'Temples, monasteries and sacred sites' },
  { name: 'Nature', slug: 'nature', description: 'Parks, hills, rivers and natural scenery' },
  { name: 'Recreation', slug: 'recreation', description: 'Parks, entertainment and leisure' },
  { name: 'Cultural', slug: 'cultural', description: 'Heritage and cultural attractions' },
  { name: 'Shopping', slug: 'shopping', description: 'Markets and shopping districts' },
];

const places = [
  {
    title: 'Butwal City Center',
    slug: 'butwal-city-center',
    description:
      'The commercial heart of Butwal, packed with markets, shops, cafes and restaurants. Traffic Chowk and Siddhartha Chowk are the city\'s busiest hubs, and the surrounding streets are perfect for an evening stroll, local shopping and street food.',
    highlights: ['Traffic Chowk and Siddhartha Chowk', 'Local markets and shopping', 'Cafes and street food', 'Easy access to nearby parks'],
    bestTime: 'October to March',
    gettingThere: 'Butwal is well connected by highway, about 25 km from Bhairahawa and a day\'s drive from Kathmandu.',
    travelTips: 'Weekday evenings are less crowded. Bargaining is common in local markets, so compare prices first.',
    city: 'BUTWAL',
    address: 'Traffic Chowk, Butwal',
    distanceKm: 0,
    rating: 4.6,
    reviewCount: 2847,
    coverImage: '/images/places/butwal-city-center-1.jpg',
    images: [
      '/images/places/butwal-city-center-1.jpg',
      '/images/places/butwal-city-center-2.jpg',
      '/images/places/butwal-city-center-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'urban',
  },
  {
    title: 'Manimukunda Park',
    slug: 'manimukunda-park',
    description:
      'A peaceful green space in Butwal built around the historic Manimukunda Sen palace garden. Wide lawns, shaded walkways and the old palace grounds make it a favourite spot for families, morning walkers and photographers.',
    highlights: ['Manimukunda Sen palace garden', 'Walking and jogging trails', 'Picnic spots', 'Family-friendly lawns'],
    bestTime: 'Morning and late afternoon',
    gettingThere: 'Located in Butwal-11, a short drive from the city center. Rickshaws and taxis drop you at the main gate.',
    travelTips: 'Carry water and snacks. The park is best enjoyed in the cooler hours of the day.',
    city: 'BUTWAL',
    address: 'Butwal-11, Rupandehi',
    distanceKm: 2,
    rating: 4.5,
    reviewCount: 985,
    coverImage: '/images/places/manimukunda-park-1.jpg',
    images: [
      '/images/places/manimukunda-park-1.jpg',
      '/images/places/manimukunda-park-2.jpg',
      '/images/places/manimukunda-park-3.jpg',
      '/images/places/manimukunda-park-4.jpg',
    ],
    isFeatured: true,
    categorySlug: 'recreation',
  },
  {
    title: 'Butwal Hill Park',
    slug: 'butwal-hill-park',
    description:
      'A scenic hilltop park with sweeping views over Butwal and the surrounding plains. The viewpoint is especially popular at sunset, when the city lights begin to appear below the hills.',
    highlights: ['Panoramic city views', 'Sunset viewpoints', 'Walking trails', 'Photography spots'],
    bestTime: 'Late afternoon to sunset',
    gettingThere: 'A short uphill drive from central Butwal. Local taxis and rickshaws are available.',
    travelTips: 'Visit around sunset for the best light and cooler temperatures. Bring a light jacket in winter.',
    city: 'BUTWAL',
    address: 'Butwal-13, Rupandehi',
    distanceKm: 3,
    rating: 4.4,
    reviewCount: 1562,
    coverImage: '/images/places/butwal-hill-park-1.jpg',
    images: [
      '/images/places/butwal-hill-park-1.jpg',
      '/images/places/butwal-hill-park-2.jpg',
      '/images/places/butwal-hill-park-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'nature',
  },
  {
    title: 'Siddha Baba Temple',
    slug: 'siddha-baba-temple',
    description:
      'A revered Hindu temple set on the banks of the Tinau River near Butwal. Surrounded by greenery and rocky riverbanks, the temple draws pilgrims and visitors throughout the year.',
    highlights: ['Riverside temple setting', 'Pilgrimage site', 'Scenic surroundings', 'Local festivals'],
    bestTime: 'October to March, early morning',
    gettingThere: 'About 6 km from Butwal city center. Taxis and rickshaws run regularly to the temple.',
    travelTips: 'Dress modestly and follow temple customs. Weekends and festival days can be busy.',
    city: 'BUTWAL',
    address: 'Siddhababa, Butwal',
    distanceKm: 6,
    rating: 4.6,
    reviewCount: 1874,
    coverImage: '/images/places/siddha-baba-temple-1.jpg',
    images: [
      '/images/places/siddha-baba-temple-1.jpg',
      '/images/places/siddha-baba-temple-2.jpg',
      '/images/places/siddha-baba-temple-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'religious',
  },
  {
    title: 'Devdaha',
    slug: 'devdaha',
    description:
      'Believed to be the maternal home of Queen Maya Devi, Devdaha is a place of Buddhist heritage near Butwal. Ancient remains, the Ashoka pillar site and the peaceful countryside make it a rewarding half-day trip.',
    highlights: ['Ashoka pillar relics', 'Buddhist heritage', 'Peaceful countryside', 'Ancient Pakari tree'],
    bestTime: 'October to March',
    gettingThere: 'About 12 km east of Butwal. Reachable by taxi or local bus from the city.',
    travelTips: 'Combine the visit with nearby villages for a full day of exploring.',
    city: 'BUTWAL',
    address: 'Devdaha, Rupandehi',
    distanceKm: 12,
    rating: 4.7,
    reviewCount: 2103,
    coverImage: '/images/places/devdaha-1.jpg',
    images: [
      '/images/places/devdaha-1.jpg',
      '/images/places/devdaha-2.jpg',
      '/images/places/devdaha-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'religious',
  },
  {
    title: 'Nuwakot Viewpoint',
    slug: 'nuwakot-viewpoint',
    description:
      'A hill viewpoint above the region offering wide views of Butwal and the Terai plains. On clear days the panorama stretches for kilometres, making it one of the best photo stops near the city.',
    highlights: ['Panoramic valley views', 'Sunrise and sunset', 'Cool hill breeze', 'Photography'],
    bestTime: 'Sunrise or clear evenings',
    gettingThere: 'A short drive from Butwal toward Palpa, followed by a short walk to the viewpoint.',
    travelTips: 'Check the weather before going. Clear days offer the best views.',
    city: 'BUTWAL',
    address: 'Nuwakot, Rupandehi',
    distanceKm: 18,
    rating: 4.5,
    reviewCount: 742,
    coverImage: '/images/places/nuwakot-viewpoint-1.jpg',
    images: [
      '/images/places/nuwakot-viewpoint-1.jpg',
      '/images/places/nuwakot-viewpoint-2.jpg',
      '/images/places/nuwakot-viewpoint-3.jpg',
    ],
    isFeatured: false,
    categorySlug: 'nature',
  },
  {
    title: 'Tinau River',
    slug: 'tinau-river',
    description:
      'The Tinau is the lifeline of Butwal, flowing past the city and the surrounding hills. Riverside walks, the Tinau dam area and quiet picnic spots make it a relaxed escape from the busy center.',
    highlights: ['Riverside walks', 'Tinau dam views', 'Picnic spots', 'Local daily life'],
    bestTime: 'October to April',
    gettingThere: 'A few kilometres from the city center. Accessible by rickshaw or taxi.',
    travelTips: 'Avoid the river during the monsoon season when currents are strong.',
    city: 'BUTWAL',
    address: 'Tinau, Butwal',
    distanceKm: 4,
    rating: 4.3,
    reviewCount: 638,
    coverImage: '/images/places/tinau-river-1.jpg',
    images: [
      '/images/places/tinau-river-1.jpg',
      '/images/places/tinau-river-2.jpg',
      '/images/places/tinau-river-3.jpg',
    ],
    isFeatured: false,
    categorySlug: 'nature',
  },
  {
    title: 'Bhairahawa (Siddharthanagar)',
    slug: 'bhairahawa',
    description:
      'A bustling border city with great shopping, dining and easy access to the Indian border. Bhairahawa, officially Siddharthanagar, is also the main gateway for travelers heading to Lumbini and the wider region.',
    highlights: ['Siddhartha Chowk', 'Local markets', 'Dining and cafes', 'Border access'],
    bestTime: 'October to March',
    gettingThere: 'Located in Rupandehi, about 25 km from Butwal. Served by road and nearby Gautam Buddha International Airport.',
    travelTips: 'Traffic is heavy around the border. Plan extra time for transfers and keep documents handy.',
    city: 'BHAIRAHWA',
    address: 'Siddharthanagar, Rupandehi',
    distanceKm: 0,
    rating: 4.4,
    reviewCount: 1204,
    coverImage: '/images/places/bhairahawa-1.jpg',
    images: ['/images/places/bhairahawa-1.jpg', '/images/places/bhairahawa-2.jpg'],
    isFeatured: true,
    categorySlug: 'urban',
  },
  {
    title: 'Bhairahawa Market',
    slug: 'bhairahawa-market',
    description:
      'Bustling local markets offering traditional goods, clothing, spices and delicious street food. The market area is a great place to experience everyday life in Bhairahawa and pick up souvenirs.',
    highlights: ['Local goods and clothing', 'Street food', 'Spices and textiles', 'Budget shopping'],
    bestTime: 'Morning and early evening',
    gettingThere: 'In the main market area of Bhairahawa, walkable from Siddhartha Chowk.',
    travelTips: 'Carry small cash and compare prices before buying.',
    city: 'BHAIRAHWA',
    address: 'Main Market, Bhairahawa',
    distanceKm: 1,
    rating: 4.2,
    reviewCount: 634,
    coverImage: '/images/places/bhairahawa-market-1.jpg',
    images: ['/images/places/bhairahawa-market-1.jpg', '/images/places/bhairahawa-market-2.jpg'],
    isFeatured: false,
    categorySlug: 'shopping',
  },
  {
    title: 'Gautam Buddha International Airport',
    slug: 'gautam-buddha-international-airport',
    description:
      'Nepal\'s second international airport, serving as the gateway to the region and connecting travelers from around the world. The modern terminal handles domestic and international flights.',
    highlights: ['International terminal', 'Gateway to the region', 'Modern facilities', 'Direct flights'],
    bestTime: 'Year-round',
    gettingThere: 'About 5 km from Bhairahawa city center. Taxis are available at the terminal.',
    travelTips: 'Arrive at least two hours before domestic and three hours before international departures.',
    city: 'BHAIRAHWA',
    address: 'Bhairahawa, Rupandehi',
    distanceKm: 5,
    rating: 4.6,
    reviewCount: 1876,
    coverImage: '/images/places/gautam-buddha-international-airport-1.jpg',
    images: [
      '/images/places/gautam-buddha-international-airport-1.jpg',
      '/images/places/gautam-buddha-international-airport-2.jpg',
      '/images/places/gautam-buddha-international-airport-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'cultural',
  },
  {
    title: 'Ramgram Stupa',
    slug: 'ramgram-stupa',
    description:
      'One of the few ancient relic stupas in Nepal that remains undisturbed. Located near Parasi, about an hour from Bhairahawa, Ramgram is a peaceful Buddhist site with a quiet, contemplative atmosphere.',
    highlights: ['Ancient Buddhist stupa', 'Peaceful grounds', 'Local heritage', 'Day trip from Bhairahawa'],
    bestTime: 'October to March',
    gettingThere: 'Near Parasi, around 55 km from Bhairahawa by road. Taxis and local buses are available.',
    travelTips: 'Combine the visit with Parasi town for local food and markets.',
    city: 'BHAIRAHWA',
    address: 'Ramgram, Parasi',
    distanceKm: 55,
    rating: 4.5,
    reviewCount: 912,
    coverImage: '/images/places/ramgram-stupa-1.jpg',
    images: [
      '/images/places/ramgram-stupa-1.jpg',
      '/images/places/ramgram-stupa-2.jpg',
      '/images/places/ramgram-stupa-3.jpg',
    ],
    isFeatured: true,
    categorySlug: 'religious',
  },
  {
    title: 'Sunauli Border',
    slug: 'sunauli-border',
    description:
      'The main Nepal-India border crossing near Bhairahawa. A busy gateway for trade and travel, the area is lined with bazaars, currency exchanges and transport links on both sides.',
    highlights: ['Nepal-India border gate', 'Cross-border trade', 'Traveler entry point', 'Local bazaars'],
    bestTime: 'Morning to early evening',
    gettingThere: 'About 3 km from Bhairahawa city center. Rickshaws and taxis are easy to find.',
    travelTips: 'Keep your documents handy and expect queues at peak hours.',
    city: 'BHAIRAHWA',
    address: 'Sunauli, Bhairahawa',
    distanceKm: 3,
    rating: 4.1,
    reviewCount: 811,
    coverImage: '/images/places/sunauli-border-1.jpg',
    images: [
      '/images/places/sunauli-border-1.jpg',
      '/images/places/sunauli-border-2.jpg',
      '/images/places/sunauli-border-3.jpg',
    ],
    isFeatured: false,
    categorySlug: 'cultural',
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cityverse.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'CityVerse Admin';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: 'ADMIN',
      },
    });
    console.log(`Seeded admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  const categoryBySlug = {};
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
    categoryBySlug[category.slug] = record.id;
  }

  for (const place of places) {
    const { categorySlug, images = [], ...data } = place;
    const record = await prisma.place.upsert({
      where: { slug: place.slug },
      update: { ...data, categoryId: categoryBySlug[categorySlug] },
      create: { ...data, categoryId: categoryBySlug[categorySlug] },
    });

    await prisma.placeImage.deleteMany({ where: { placeId: record.id } });
    if (images.length) {
      await prisma.placeImage.createMany({
        data: images.map((url) => ({ url, alt: place.title, placeId: record.id })),
      });
    }
  }

  console.log(`Seeded ${categories.length} categories and ${places.length} places.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
