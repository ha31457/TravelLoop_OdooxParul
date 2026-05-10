using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Models;

namespace Travel_Odoo.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<User> userManager)
    {
        if (await context.Countries.AnyAsync() && await context.Trips.AnyAsync())
            return;

        // ── 1. Users ─────────────────────────────────────────────────────────

        var adminUser = await userManager.FindByEmailAsync("admin@travel.com");
        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName       = "admin@travel.com",
                Email          = "admin@travel.com",
                FullName       = "Admin User",
                IsAdmin        = true,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, "Admin@123!");
        }

        var friendUser = await userManager.FindByEmailAsync("friend@example.com");
        if (friendUser == null)
        {
            friendUser = new User
            {
                UserName       = "friend@example.com",
                Email          = "friend@example.com",
                FullName       = "Travel Buddy",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(friendUser, "Friend@123!");
        }

        var testUser = await userManager.FindByEmailAsync("test@travel.com");
        if (testUser == null)
        {
            testUser = new User
            {
                UserName       = "test@travel.com",
                Email          = "test@travel.com",
                FullName       = "Test Traveler",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(testUser, "Test@123!");
        }

        if (await context.Countries.AnyAsync()) return;

        // ── 2. Countries ─────────────────────────────────────────────────────

        var france   = new Country { Id = Guid.NewGuid(), Name = "France",         IsoCode = "FRA", Region = "Europe"        };
        var japan    = new Country { Id = Guid.NewGuid(), Name = "Japan",           IsoCode = "JPN", Region = "Asia"          };
        var usa      = new Country { Id = Guid.NewGuid(), Name = "United States",   IsoCode = "USA", Region = "North America" };
        var india    = new Country { Id = Guid.NewGuid(), Name = "India",           IsoCode = "IND", Region = "Asia"          };
        var italy    = new Country { Id = Guid.NewGuid(), Name = "Italy",           IsoCode = "ITA", Region = "Europe"        };
        var thailand = new Country { Id = Guid.NewGuid(), Name = "Thailand",        IsoCode = "THA", Region = "Asia"          };
        var uk       = new Country { Id = Guid.NewGuid(), Name = "United Kingdom",  IsoCode = "GBR", Region = "Europe"        };
        var spain    = new Country { Id = Guid.NewGuid(), Name = "Spain",           IsoCode = "ESP", Region = "Europe"        };
        var uae      = new Country { Id = Guid.NewGuid(), Name = "UAE",             IsoCode = "ARE", Region = "Middle East"   };
        var australia= new Country { Id = Guid.NewGuid(), Name = "Australia",       IsoCode = "AUS", Region = "Oceania"       };

        await context.Countries.AddRangeAsync(
            france, japan, usa, india, italy, thailand, uk, spain, uae, australia);

        // ── 3. Cities ─────────────────────────────────────────────────────────

        var paris     = new City { Id = Guid.NewGuid(), Name = "Paris",     CountryId = france.Id,    Region = "Île-de-France",  Latitude = 48.8566m,  Longitude = 2.3522m,    PopularityScore = 100, CostIndex = 4, ThumbnailUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" };
        var nice      = new City { Id = Guid.NewGuid(), Name = "Nice",      CountryId = france.Id,    Region = "Provence",       Latitude = 43.7102m,  Longitude = 7.2620m,    PopularityScore = 72,  CostIndex = 3, ThumbnailUrl = "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca" };
        var tokyo     = new City { Id = Guid.NewGuid(), Name = "Tokyo",     CountryId = japan.Id,     Region = "Kanto",          Latitude = 35.6762m,  Longitude = 139.6503m,  PopularityScore = 95,  CostIndex = 4, ThumbnailUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26" };
        var kyoto     = new City { Id = Guid.NewGuid(), Name = "Kyoto",     CountryId = japan.Id,     Region = "Kansai",         Latitude = 35.0116m,  Longitude = 135.7681m,  PopularityScore = 88,  CostIndex = 3, ThumbnailUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" };
        var osaka     = new City { Id = Guid.NewGuid(), Name = "Osaka",     CountryId = japan.Id,     Region = "Kansai",         Latitude = 34.6937m,  Longitude = 135.5023m,  PopularityScore = 85,  CostIndex = 3, ThumbnailUrl = "https://images.unsplash.com/photo-1590559899731-a382839e5549" };
        var newYork   = new City { Id = Guid.NewGuid(), Name = "New York",  CountryId = usa.Id,       Region = "New York",       Latitude = 40.7128m,  Longitude = -74.0060m,  PopularityScore = 90,  CostIndex = 5, ThumbnailUrl = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9" };
        var lasVegas  = new City { Id = Guid.NewGuid(), Name = "Las Vegas", CountryId = usa.Id,       Region = "Nevada",         Latitude = 36.1699m,  Longitude = -115.1398m, PopularityScore = 80,  CostIndex = 4, ThumbnailUrl = "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4" };
        var mumbai    = new City { Id = Guid.NewGuid(), Name = "Mumbai",    CountryId = india.Id,     Region = "Maharashtra",    Latitude = 19.0760m,  Longitude = 72.8777m,   PopularityScore = 85,  CostIndex = 2, ThumbnailUrl = "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f" };
        var delhi     = new City { Id = Guid.NewGuid(), Name = "Delhi",     CountryId = india.Id,     Region = "NCT",            Latitude = 28.6139m,  Longitude = 77.2090m,   PopularityScore = 80,  CostIndex = 2, ThumbnailUrl = "https://images.unsplash.com/photo-1587474260584-136574528ed5" };
        var goa       = new City { Id = Guid.NewGuid(), Name = "Goa",       CountryId = india.Id,     Region = "Goa",            Latitude = 15.2993m,  Longitude = 74.1240m,   PopularityScore = 82,  CostIndex = 2, ThumbnailUrl = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" };
        var rome      = new City { Id = Guid.NewGuid(), Name = "Rome",      CountryId = italy.Id,     Region = "Lazio",          Latitude = 41.9028m,  Longitude = 12.4964m,   PopularityScore = 93,  CostIndex = 3, ThumbnailUrl = "https://images.unsplash.com/photo-1552832230-c0197dd311b5" };
        var venice    = new City { Id = Guid.NewGuid(), Name = "Venice",    CountryId = italy.Id,     Region = "Veneto",         Latitude = 45.4408m,  Longitude = 12.3155m,   PopularityScore = 88,  CostIndex = 4, ThumbnailUrl = "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f" };
        var bangkok   = new City { Id = Guid.NewGuid(), Name = "Bangkok",   CountryId = thailand.Id,  Region = "Central",        Latitude = 13.7563m,  Longitude = 100.5018m,  PopularityScore = 87,  CostIndex = 2, ThumbnailUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5" };
        var phuket    = new City { Id = Guid.NewGuid(), Name = "Phuket",    CountryId = thailand.Id,  Region = "Southern",       Latitude = 7.8804m,   Longitude = 98.3923m,   PopularityScore = 84,  CostIndex = 2, ThumbnailUrl = "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5" };
        var london    = new City { Id = Guid.NewGuid(), Name = "London",    CountryId = uk.Id,        Region = "England",        Latitude = 51.5074m,  Longitude = -0.1278m,   PopularityScore = 96,  CostIndex = 5, ThumbnailUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad" };
        var barcelona = new City { Id = Guid.NewGuid(), Name = "Barcelona", CountryId = spain.Id,     Region = "Catalonia",      Latitude = 41.3851m,  Longitude = 2.1734m,    PopularityScore = 91,  CostIndex = 3, ThumbnailUrl = "https://images.unsplash.com/photo-1583422409516-2895a77efded" };
        var dubai     = new City { Id = Guid.NewGuid(), Name = "Dubai",     CountryId = uae.Id,       Region = "Dubai",          Latitude = 25.2048m,  Longitude = 55.2708m,   PopularityScore = 89,  CostIndex = 5, ThumbnailUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" };
        var sydney    = new City { Id = Guid.NewGuid(), Name = "Sydney",    CountryId = australia.Id, Region = "New South Wales", Latitude = -33.8688m, Longitude = 151.2093m,  PopularityScore = 90,  CostIndex = 4, ThumbnailUrl = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9" };

        await context.Cities.AddRangeAsync(
            paris, nice, tokyo, kyoto, osaka, newYork, lasVegas,
            mumbai, delhi, goa, rome, venice, bangkok, phuket,
            london, barcelona, dubai, sydney);

        // ── 4. City Activities ────────────────────────────────────────────────

        var activities = new List<CityActivity>
        {
            // Paris
            new() { Id = Guid.NewGuid(), CityId = paris.Id, Name = "Eiffel Tower Visit",        Category = ActivityCategory.Sightseeing, EstimatedCost = 30m,  DurationMinutes = 120, PopularityScore = 100, Description = "Visit the iconic iron lattice tower on the Champ de Mars.",           ThumbnailUrl = "https://images.unsplash.com/photo-1543305113-251f224f8e02" },
            new() { Id = Guid.NewGuid(), CityId = paris.Id, Name = "Louvre Museum",              Category = ActivityCategory.Culture,     EstimatedCost = 20m,  DurationMinutes = 240, PopularityScore = 95,  Description = "Explore the world's largest art museum and home of the Mona Lisa.",  ThumbnailUrl = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a" },
            new() { Id = Guid.NewGuid(), CityId = paris.Id, Name = "Montmartre Café Tour",       Category = ActivityCategory.FoodAndDrink,EstimatedCost = 40m,  DurationMinutes = 120, PopularityScore = 85,  Description = "Enjoy the finest pastries and coffee in the bohemian Montmartre district." },
            new() { Id = Guid.NewGuid(), CityId = paris.Id, Name = "Seine River Cruise",         Category = ActivityCategory.Sightseeing, EstimatedCost = 25m,  DurationMinutes = 90,  PopularityScore = 88,  Description = "Cruise along the Seine and see Paris landmarks from the water." },
            new() { Id = Guid.NewGuid(), CityId = paris.Id, Name = "Palace of Versailles",       Category = ActivityCategory.Culture,     EstimatedCost = 20m,  DurationMinutes = 300, PopularityScore = 92,  Description = "Day trip to the grand royal palace and its magnificent gardens." },

            // Tokyo
            new() { Id = Guid.NewGuid(), CityId = tokyo.Id, Name = "Tsukiji Outer Market",       Category = ActivityCategory.FoodAndDrink,EstimatedCost = 50m,  DurationMinutes = 180, PopularityScore = 90,  Description = "Taste fresh sushi and Japanese street food at the famous outer market." },
            new() { Id = Guid.NewGuid(), CityId = tokyo.Id, Name = "Shibuya Crossing",            Category = ActivityCategory.Sightseeing, EstimatedCost = 0m,   DurationMinutes = 60,  PopularityScore = 98,  Description = "Walk across the world's busiest pedestrian intersection." },
            new() { Id = Guid.NewGuid(), CityId = tokyo.Id, Name = "Senso-ji Temple",             Category = ActivityCategory.Culture,     EstimatedCost = 0m,   DurationMinutes = 90,  PopularityScore = 95,  Description = "Visit Tokyo's oldest temple in the historic Asakusa district." },
            new() { Id = Guid.NewGuid(), CityId = tokyo.Id, Name = "TeamLab Planets",             Category = ActivityCategory.Culture,     EstimatedCost = 32m,  DurationMinutes = 120, PopularityScore = 91,  Description = "An immersive digital art museum unlike anything else." },
            new() { Id = Guid.NewGuid(), CityId = tokyo.Id, Name = "Shinjuku Izakaya Hopping",   Category = ActivityCategory.Nightlife,   EstimatedCost = 60m,  DurationMinutes = 180, PopularityScore = 87,  Description = "Bar hop through the neon-lit alleys of Shinjuku's Golden Gai." },

            // Kyoto
            new() { Id = Guid.NewGuid(), CityId = kyoto.Id, Name = "Fushimi Inari Shrine",       Category = ActivityCategory.Culture,     EstimatedCost = 0m,   DurationMinutes = 150, PopularityScore = 98,  Description = "Walk through thousands of vermillion torii gates up the mountain." },
            new() { Id = Guid.NewGuid(), CityId = kyoto.Id, Name = "Traditional Tea Ceremony",   Category = ActivityCategory.FoodAndDrink,EstimatedCost = 60m,  DurationMinutes = 90,  PopularityScore = 90,  Description = "Experience an authentic Japanese tea ceremony in a historic teahouse." },
            new() { Id = Guid.NewGuid(), CityId = kyoto.Id, Name = "Arashiyama Bamboo Grove",    Category = ActivityCategory.Nature,      EstimatedCost = 0m,   DurationMinutes = 90,  PopularityScore = 94,  Description = "Walk through towering bamboo stalks in the iconic Arashiyama grove." },
            new() { Id = Guid.NewGuid(), CityId = kyoto.Id, Name = "Nishiki Market",             Category = ActivityCategory.Shopping,    EstimatedCost = 30m,  DurationMinutes = 120, PopularityScore = 82,  Description = "Browse Kyoto's vibrant indoor market known as 'Kyoto's Kitchen'." },

            // Osaka
            new() { Id = Guid.NewGuid(), CityId = osaka.Id, Name = "Dotonbori Food Walk",        Category = ActivityCategory.FoodAndDrink,EstimatedCost = 45m,  DurationMinutes = 150, PopularityScore = 96,  Description = "Eat your way through Osaka's iconic neon-lit food street." },
            new() { Id = Guid.NewGuid(), CityId = osaka.Id, Name = "Osaka Castle",               Category = ActivityCategory.Sightseeing, EstimatedCost = 10m,  DurationMinutes = 120, PopularityScore = 88,  Description = "Tour the historic castle and its surrounding parkland." },
            new() { Id = Guid.NewGuid(), CityId = osaka.Id, Name = "Universal Studios Japan",    Category = ActivityCategory.Adventure,   EstimatedCost = 85m,  DurationMinutes = 480, PopularityScore = 90,  Description = "Full day at one of Japan's top theme parks." },

            // New York
            new() { Id = Guid.NewGuid(), CityId = newYork.Id, Name = "Central Park Walk",        Category = ActivityCategory.Nature,      EstimatedCost = 0m,   DurationMinutes = 120, PopularityScore = 80,  Description = "Stroll through New York's iconic 843-acre urban park." },
            new() { Id = Guid.NewGuid(), CityId = newYork.Id, Name = "Brooklyn Pizza Tour",      Category = ActivityCategory.FoodAndDrink,EstimatedCost = 35m,  DurationMinutes = 180, PopularityScore = 92,  Description = "Sample the best New York-style pizza slices in Brooklyn." },
            new() { Id = Guid.NewGuid(), CityId = newYork.Id, Name = "Statue of Liberty",        Category = ActivityCategory.Sightseeing, EstimatedCost = 25m,  DurationMinutes = 180, PopularityScore = 91,  Description = "Ferry to Liberty Island and see the iconic statue up close." },
            new() { Id = Guid.NewGuid(), CityId = newYork.Id, Name = "Broadway Show",            Category = ActivityCategory.Culture,     EstimatedCost = 120m, DurationMinutes = 180, PopularityScore = 95,  Description = "Watch a world-class musical or play on the famous Broadway strip." },
            new() { Id = Guid.NewGuid(), CityId = newYork.Id, Name = "High Line Walk",           Category = ActivityCategory.Nature,      EstimatedCost = 0m,   DurationMinutes = 90,  PopularityScore = 85,  Description = "Walk along this elevated park built on a historic freight rail line." },

            // Mumbai
            new() { Id = Guid.NewGuid(), CityId = mumbai.Id, Name = "Gateway of India",          Category = ActivityCategory.Sightseeing, EstimatedCost = 0m,   DurationMinutes = 60,  PopularityScore = 85,  Description = "Visit the historic arch monument overlooking the Arabian Sea." },
            new() { Id = Guid.NewGuid(), CityId = mumbai.Id, Name = "Chowpatty Street Food",     Category = ActivityCategory.FoodAndDrink,EstimatedCost = 15m,  DurationMinutes = 120, PopularityScore = 88,  Description = "Taste authentic pav bhaji, bhel puri and more at Chowpatty Beach." },
            new() { Id = Guid.NewGuid(), CityId = mumbai.Id, Name = "Dharavi Walking Tour",      Category = ActivityCategory.Culture,     EstimatedCost = 20m,  DurationMinutes = 180, PopularityScore = 75,  Description = "A guided walk through Asia's largest urban township." },
            new() { Id = Guid.NewGuid(), CityId = mumbai.Id, Name = "Elephanta Caves",           Category = ActivityCategory.Culture,     EstimatedCost = 10m,  DurationMinutes = 240, PopularityScore = 80,  Description = "Ferry to the UNESCO World Heritage cave temples." },

            // Delhi
            new() { Id = Guid.NewGuid(), CityId = delhi.Id, Name = "Red Fort",                  Category = ActivityCategory.Culture,     EstimatedCost = 5m,   DurationMinutes = 120, PopularityScore = 85,  Description = "Explore the massive 17th-century red sandstone fort." },
            new() { Id = Guid.NewGuid(), CityId = delhi.Id, Name = "Qutub Minar",               Category = ActivityCategory.Sightseeing, EstimatedCost = 5m,   DurationMinutes = 90,  PopularityScore = 82,  Description = "See the tallest brick minaret in the world, a UNESCO Heritage Site." },
            new() { Id = Guid.NewGuid(), CityId = delhi.Id, Name = "Chandni Chowk Street Food", Category = ActivityCategory.FoodAndDrink,EstimatedCost = 20m,  DurationMinutes = 150, PopularityScore = 90,  Description = "Eat your way through Delhi's oldest and most chaotic food market." },

            // Goa
            new() { Id = Guid.NewGuid(), CityId = goa.Id, Name = "Baga Beach Sunset",            Category = ActivityCategory.Wellness,    EstimatedCost = 0m,   DurationMinutes = 90,  PopularityScore = 88,  Description = "Relax and watch the golden sunset at Baga Beach." },
            new() { Id = Guid.NewGuid(), CityId = goa.Id, Name = "Old Goa Churches",             Category = ActivityCategory.Culture,     EstimatedCost = 0m,   DurationMinutes = 120, PopularityScore = 75,  Description = "Explore the Portuguese Baroque churches of Old Goa." },
            new() { Id = Guid.NewGuid(), CityId = goa.Id, Name = "Spice Plantation Tour",        Category = ActivityCategory.Nature,      EstimatedCost = 25m,  DurationMinutes = 180, PopularityScore = 78,  Description = "Tour a working spice plantation and taste fresh tropical spices." },

            // Rome
            new() { Id = Guid.NewGuid(), CityId = rome.Id, Name = "Colosseum Tour",              Category = ActivityCategory.Culture,     EstimatedCost = 22m,  DurationMinutes = 150, PopularityScore = 99,  Description = "Step inside the ancient amphitheater and relive Roman gladiator history." },
            new() { Id = Guid.NewGuid(), CityId = rome.Id, Name = "Vatican Museums",             Category = ActivityCategory.Culture,     EstimatedCost = 27m,  DurationMinutes = 240, PopularityScore = 96,  Description = "See the Sistine Chapel and centuries of papal art collections." },
            new() { Id = Guid.NewGuid(), CityId = rome.Id, Name = "Trastevere Food Walk",        Category = ActivityCategory.FoodAndDrink,EstimatedCost = 35m,  DurationMinutes = 150, PopularityScore = 88,  Description = "Sample Roman cuisine in the charming cobblestone Trastevere neighborhood." },
            new() { Id = Guid.NewGuid(), CityId = rome.Id, Name = "Trevi Fountain",              Category = ActivityCategory.Sightseeing, EstimatedCost = 0m,   DurationMinutes = 45,  PopularityScore = 92,  Description = "Toss a coin and make a wish at the Baroque Trevi Fountain." },

            // Venice
            new() { Id = Guid.NewGuid(), CityId = venice.Id, Name = "Gondola Ride",             Category = ActivityCategory.Sightseeing, EstimatedCost = 80m,  DurationMinutes = 60,  PopularityScore = 94,  Description = "Glide through Venice's historic canals on a traditional gondola." },
            new() { Id = Guid.NewGuid(), CityId = venice.Id, Name = "St. Mark's Basilica",      Category = ActivityCategory.Culture,     EstimatedCost = 3m,   DurationMinutes = 90,  PopularityScore = 91,  Description = "Visit the stunning Byzantine cathedral on St. Mark's Square." },
            new() { Id = Guid.NewGuid(), CityId = venice.Id, Name = "Murano Glass Blowing",     Category = ActivityCategory.Culture,     EstimatedCost = 15m,  DurationMinutes = 90,  PopularityScore = 84,  Description = "Watch master glassblowers at work on the island of Murano." },

            // Bangkok
            new() { Id = Guid.NewGuid(), CityId = bangkok.Id, Name = "Grand Palace",            Category = ActivityCategory.Culture,     EstimatedCost = 15m,  DurationMinutes = 150, PopularityScore = 97,  Description = "Explore the opulent royal palace and Wat Phra Kaew temple." },
            new() { Id = Guid.NewGuid(), CityId = bangkok.Id, Name = "Floating Market Tour",    Category = ActivityCategory.FoodAndDrink,EstimatedCost = 30m,  DurationMinutes = 240, PopularityScore = 88,  Description = "Shop and eat at one of Bangkok's iconic floating markets." },
            new() { Id = Guid.NewGuid(), CityId = bangkok.Id, Name = "Muay Thai Night",         Category = ActivityCategory.Adventure,   EstimatedCost = 40m,  DurationMinutes = 180, PopularityScore = 82,  Description = "Watch a live Muay Thai boxing match at a local stadium." },
            new() { Id = Guid.NewGuid(), CityId = bangkok.Id, Name = "Rooftop Bar at Lebua",    Category = ActivityCategory.Nightlife,   EstimatedCost = 50m,  DurationMinutes = 120, PopularityScore = 86,  Description = "Sip cocktails with a panoramic Bangkok skyline view." },

            // Phuket
            new() { Id = Guid.NewGuid(), CityId = phuket.Id, Name = "Phi Phi Islands Day Trip", Category = ActivityCategory.Adventure,   EstimatedCost = 65m,  DurationMinutes = 480, PopularityScore = 96,  Description = "Speedboat tour to the stunning Phi Phi archipelago." },
            new() { Id = Guid.NewGuid(), CityId = phuket.Id, Name = "Patong Beach",             Category = ActivityCategory.Wellness,    EstimatedCost = 0m,   DurationMinutes = 180, PopularityScore = 85,  Description = "Relax on Phuket's most famous beach." },
            new() { Id = Guid.NewGuid(), CityId = phuket.Id, Name = "Thai Cooking Class",       Category = ActivityCategory.FoodAndDrink,EstimatedCost = 45m,  DurationMinutes = 240, PopularityScore = 87,  Description = "Learn to cook authentic Thai dishes from a local chef." },

            // London
            new() { Id = Guid.NewGuid(), CityId = london.Id, Name = "Tower of London",          Category = ActivityCategory.Culture,     EstimatedCost = 35m,  DurationMinutes = 180, PopularityScore = 92,  Description = "Discover 1,000 years of history and the Crown Jewels." },
            new() { Id = Guid.NewGuid(), CityId = london.Id, Name = "Borough Market",           Category = ActivityCategory.FoodAndDrink,EstimatedCost = 25m,  DurationMinutes = 120, PopularityScore = 88,  Description = "One of London's oldest and most famous food markets." },
            new() { Id = Guid.NewGuid(), CityId = london.Id, Name = "British Museum",           Category = ActivityCategory.Culture,     EstimatedCost = 0m,   DurationMinutes = 240, PopularityScore = 93,  Description = "See over 8 million works from human history and culture — free entry." },
            new() { Id = Guid.NewGuid(), CityId = london.Id, Name = "Thames River Walk",        Category = ActivityCategory.Nature,      EstimatedCost = 0m,   DurationMinutes = 90,  PopularityScore = 80,  Description = "Walk along the Thames from Tower Bridge to Tate Modern." },

            // Barcelona
            new() { Id = Guid.NewGuid(), CityId = barcelona.Id, Name = "Sagrada Família",       Category = ActivityCategory.Culture,     EstimatedCost = 26m,  DurationMinutes = 150, PopularityScore = 99,  Description = "Gaudí's breathtaking unfinished basilica, a UNESCO World Heritage Site." },
            new() { Id = Guid.NewGuid(), CityId = barcelona.Id, Name = "Park Güell",            Category = ActivityCategory.Sightseeing, EstimatedCost = 10m,  DurationMinutes = 120, PopularityScore = 90,  Description = "Explore Gaudí's whimsical hilltop park with stunning city views." },
            new() { Id = Guid.NewGuid(), CityId = barcelona.Id, Name = "La Boqueria Market",    Category = ActivityCategory.FoodAndDrink,EstimatedCost = 20m,  DurationMinutes = 90,  PopularityScore = 88,  Description = "Browse and taste at Barcelona's most famous food market on Las Ramblas." },
            new() { Id = Guid.NewGuid(), CityId = barcelona.Id, Name = "Barceloneta Beach",     Category = ActivityCategory.Wellness,    EstimatedCost = 0m,   DurationMinutes = 180, PopularityScore = 84,  Description = "Relax on Barcelona's most popular urban beach." },

            // Dubai
            new() { Id = Guid.NewGuid(), CityId = dubai.Id, Name = "Burj Khalifa Observation",  Category = ActivityCategory.Sightseeing, EstimatedCost = 40m,  DurationMinutes = 90,  PopularityScore = 97,  Description = "Go to the top of the world's tallest building for panoramic views." },
            new() { Id = Guid.NewGuid(), CityId = dubai.Id, Name = "Desert Safari",             Category = ActivityCategory.Adventure,   EstimatedCost = 75m,  DurationMinutes = 360, PopularityScore = 95,  Description = "Dune bashing, camel rides, and a BBQ dinner under the stars." },
            new() { Id = Guid.NewGuid(), CityId = dubai.Id, Name = "Dubai Mall & Fountain Show", Category = ActivityCategory.Shopping,   EstimatedCost = 0m,   DurationMinutes = 180, PopularityScore = 88,  Description = "Shop at the world's largest mall and watch the spectacular fountain show." },
            new() { Id = Guid.NewGuid(), CityId = dubai.Id, Name = "Dubai Creek Dhow Cruise",   Category = ActivityCategory.FoodAndDrink,EstimatedCost = 55m,  DurationMinutes = 150, PopularityScore = 85,  Description = "Traditional wooden boat dinner cruise along the historic Dubai Creek." },

            // Sydney
            new() { Id = Guid.NewGuid(), CityId = sydney.Id, Name = "Sydney Opera House Tour",  Category = ActivityCategory.Culture,     EstimatedCost = 43m,  DurationMinutes = 90,  PopularityScore = 98,  Description = "Guided tour inside one of the world's most iconic buildings." },
            new() { Id = Guid.NewGuid(), CityId = sydney.Id, Name = "Bondi to Coogee Walk",     Category = ActivityCategory.Nature,      EstimatedCost = 0m,   DurationMinutes = 150, PopularityScore = 92,  Description = "Scenic coastal walk along some of Sydney's most beautiful beaches." },
            new() { Id = Guid.NewGuid(), CityId = sydney.Id, Name = "Harbour Bridge Climb",     Category = ActivityCategory.Adventure,   EstimatedCost = 180m, DurationMinutes = 180, PopularityScore = 90,  Description = "Climb to the top of the Sydney Harbour Bridge for unforgettable views." },
        };

        await context.CityActivities.AddRangeAsync(activities);

        // ── 5. Activity Images ────────────────────────────────────────────────

        var eiffelActivity    = activities.First(a => a.Name == "Eiffel Tower Visit");
        var colosseum         = activities.First(a => a.Name == "Colosseum Tour");
        var sagrada           = activities.First(a => a.Name == "Sagrada Família");
        var burj              = activities.First(a => a.Name == "Burj Khalifa Observation");
        var operaHouse        = activities.First(a => a.Name == "Sydney Opera House Tour");

        await context.ActivityImages.AddRangeAsync(
            new ActivityImage { CityActivityId = eiffelActivity.Id, ImageUrl = "https://images.unsplash.com/photo-1543305113-251f224f8e02", IsPrimary = true,  SortOrder = 0 },
            new ActivityImage { CityActivityId = eiffelActivity.Id, ImageUrl = "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", IsPrimary = false, SortOrder = 1 },
            new ActivityImage { CityActivityId = colosseum.Id,      ImageUrl = "https://images.unsplash.com/photo-1552832230-c0197dd311b5", IsPrimary = true,  SortOrder = 0 },
            new ActivityImage { CityActivityId = sagrada.Id,        ImageUrl = "https://images.unsplash.com/photo-1583422409516-2895a77efded", IsPrimary = true,  SortOrder = 0 },
            new ActivityImage { CityActivityId = burj.Id,           ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", IsPrimary = true,  SortOrder = 0 },
            new ActivityImage { CityActivityId = operaHouse.Id,     ImageUrl = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9", IsPrimary = true,  SortOrder = 0 }
        );

        // ── 6. Saved Destinations ─────────────────────────────────────────────

        await context.SavedDestinations.AddRangeAsync(
            new SavedDestination { UserId = adminUser.Id, CityId = tokyo.Id,     SavedAt = DateTime.UtcNow },
            new SavedDestination { UserId = adminUser.Id, CityId = barcelona.Id, SavedAt = DateTime.UtcNow },
            new SavedDestination { UserId = testUser.Id,  CityId = dubai.Id,     SavedAt = DateTime.UtcNow },
            new SavedDestination { UserId = testUser.Id,  CityId = paris.Id,     SavedAt = DateTime.UtcNow }
        );

        // ── 7. Trips ──────────────────────────────────────────────────────────

        var euroTrip = new Trip
        {
            Id           = Guid.NewGuid(),
            UserId       = adminUser.Id,
            Name         = "Euro Summer 2024",
            Description  = "A 2-week summer trip across France and Italy.",
            StartDate    = new DateOnly(2024, 7, 1),
            EndDate      = new DateOnly(2024, 7, 14),
            Status       = TripStatus.Planned,
            IsPublic     = true,
            PublicSlug   = "euro-summer-2024",
            TotalBudget  = 5000m,
            CurrencyCode = "INR"
        };

        var asiaTrip = new Trip
        {
            Id           = Guid.NewGuid(),
            UserId       = adminUser.Id,
            Name         = "Japan & Thailand Adventure",
            Description  = "Exploring the best of East and Southeast Asia.",
            StartDate    = new DateOnly(2024, 9, 10),
            EndDate      = new DateOnly(2024, 9, 25),
            Status       = TripStatus.Draft,
            IsPublic     = false,
            TotalBudget  = 4000m,
            CurrencyCode = "INR"
        };

        var indiaTrip = new Trip
        {
            Id           = Guid.NewGuid(),
            UserId       = testUser.Id,
            Name         = "India Highlights",
            Description  = "Mumbai, Delhi, and the beaches of Goa.",
            StartDate    = new DateOnly(2024, 12, 20),
            EndDate      = new DateOnly(2024, 12, 31),
            Status       = TripStatus.Draft,
            IsPublic     = false,
            TotalBudget  = 80000m,
            CurrencyCode = "INR"
        };

        await context.Trips.AddRangeAsync(euroTrip, asiaTrip, indiaTrip);

        // ── 8. Trip Stops ─────────────────────────────────────────────────────

        var stopParis = new TripStop
        {
            Id = Guid.NewGuid(), TripId = euroTrip.Id, CityId = paris.Id,
            OrderIndex = 0, ArrivalDate = new DateOnly(2024, 7, 1), DepartureDate = new DateOnly(2024, 7, 6),
            Notes = "Staying near the Marais district."
        };
        var stopRome = new TripStop
        {
            Id = Guid.NewGuid(), TripId = euroTrip.Id, CityId = rome.Id,
            OrderIndex = 1, ArrivalDate = new DateOnly(2024, 7, 6), DepartureDate = new DateOnly(2024, 7, 10),
            Notes = "Book Colosseum tickets in advance."
        };
        var stopVenice = new TripStop
        {
            Id = Guid.NewGuid(), TripId = euroTrip.Id, CityId = venice.Id,
            OrderIndex = 2, ArrivalDate = new DateOnly(2024, 7, 10), DepartureDate = new DateOnly(2024, 7, 14),
            Notes = "Get vaporetto passes on arrival."
        };

        var stopTokyo = new TripStop
        {
            Id = Guid.NewGuid(), TripId = asiaTrip.Id, CityId = tokyo.Id,
            OrderIndex = 0, ArrivalDate = new DateOnly(2024, 9, 10), DepartureDate = new DateOnly(2024, 9, 15),
            Notes = "Stay in Shinjuku."
        };
        var stopKyoto = new TripStop
        {
            Id = Guid.NewGuid(), TripId = asiaTrip.Id, CityId = kyoto.Id,
            OrderIndex = 1, ArrivalDate = new DateOnly(2024, 9, 15), DepartureDate = new DateOnly(2024, 9, 18),
        };
        var stopBangkok = new TripStop
        {
            Id = Guid.NewGuid(), TripId = asiaTrip.Id, CityId = bangkok.Id,
            OrderIndex = 2, ArrivalDate = new DateOnly(2024, 9, 18), DepartureDate = new DateOnly(2024, 9, 25),
            Notes = "Book Grand Palace early morning to avoid crowds."
        };

        var stopMumbai = new TripStop
        {
            Id = Guid.NewGuid(), TripId = indiaTrip.Id, CityId = mumbai.Id,
            OrderIndex = 0, ArrivalDate = new DateOnly(2024, 12, 20), DepartureDate = new DateOnly(2024, 12, 23),
        };
        var stopGoa = new TripStop
        {
            Id = Guid.NewGuid(), TripId = indiaTrip.Id, CityId = goa.Id,
            OrderIndex = 1, ArrivalDate = new DateOnly(2024, 12, 23), DepartureDate = new DateOnly(2024, 12, 31),
            Notes = "Book beach shack in North Goa."
        };

        await context.TripStops.AddRangeAsync(
            stopParis, stopRome, stopVenice,
            stopTokyo, stopKyoto, stopBangkok,
            stopMumbai, stopGoa);

        // ── 9. Stop Activities ────────────────────────────────────────────────

        var actEiffel     = activities.First(a => a.Name == "Eiffel Tower Visit");
        var actLouvre     = activities.First(a => a.Name == "Louvre Museum");
        var actSeine      = activities.First(a => a.Name == "Seine River Cruise");
        var actColosseum  = activities.First(a => a.Name == "Colosseum Tour");
        var actVatican    = activities.First(a => a.Name == "Vatican Museums");
        var actTrevi      = activities.First(a => a.Name == "Trevi Fountain");
        var actGondola    = activities.First(a => a.Name == "Gondola Ride");
        var actShibuya    = activities.First(a => a.Name == "Shibuya Crossing");
        var actTsukiji    = activities.First(a => a.Name == "Tsukiji Outer Market");
        var actFushimi    = activities.First(a => a.Name == "Fushimi Inari Shrine");
        var actTea        = activities.First(a => a.Name == "Traditional Tea Ceremony");
        var actGrandPalace= activities.First(a => a.Name == "Grand Palace");
        var actFloating   = activities.First(a => a.Name == "Floating Market Tour");
        var actGateway    = activities.First(a => a.Name == "Gateway of India");
        var actBaga       = activities.First(a => a.Name == "Baga Beach Sunset");

        await context.StopActivities.AddRangeAsync(
            new StopActivity { TripStopId = stopParis.Id,   CityActivityId = actEiffel.Id,      PlannedDate = new DateOnly(2024, 7, 2), PlannedTime = new TimeOnly(10, 0), ActualCost = 32m  },
            new StopActivity { TripStopId = stopParis.Id,   CityActivityId = actLouvre.Id,      PlannedDate = new DateOnly(2024, 7, 3), PlannedTime = new TimeOnly(9, 0)                     },
            new StopActivity { TripStopId = stopParis.Id,   CityActivityId = actSeine.Id,       PlannedDate = new DateOnly(2024, 7, 4), PlannedTime = new TimeOnly(18, 0)                    },
            new StopActivity { TripStopId = stopRome.Id,    CityActivityId = actColosseum.Id,   PlannedDate = new DateOnly(2024, 7, 7), PlannedTime = new TimeOnly(9, 0)                     },
            new StopActivity { TripStopId = stopRome.Id,    CityActivityId = actVatican.Id,     PlannedDate = new DateOnly(2024, 7, 8), PlannedTime = new TimeOnly(10, 0)                    },
            new StopActivity { TripStopId = stopRome.Id,    CityActivityId = actTrevi.Id,       PlannedDate = new DateOnly(2024, 7, 9), PlannedTime = new TimeOnly(20, 0)                    },
            new StopActivity { TripStopId = stopVenice.Id,  CityActivityId = actGondola.Id,     PlannedDate = new DateOnly(2024, 7, 11), PlannedTime = new TimeOnly(16, 0), ActualCost = 85m },
            new StopActivity { TripStopId = stopTokyo.Id,   CityActivityId = actShibuya.Id,     PlannedDate = new DateOnly(2024, 9, 11), PlannedTime = new TimeOnly(20, 0)                   },
            new StopActivity { TripStopId = stopTokyo.Id,   CityActivityId = actTsukiji.Id,     PlannedDate = new DateOnly(2024, 9, 12), PlannedTime = new TimeOnly(7, 0)                    },
            new StopActivity { TripStopId = stopKyoto.Id,   CityActivityId = actFushimi.Id,     PlannedDate = new DateOnly(2024, 9, 16), PlannedTime = new TimeOnly(8, 0)                    },
            new StopActivity { TripStopId = stopKyoto.Id,   CityActivityId = actTea.Id,         PlannedDate = new DateOnly(2024, 9, 17), PlannedTime = new TimeOnly(15, 0)                   },
            new StopActivity { TripStopId = stopBangkok.Id, CityActivityId = actGrandPalace.Id, PlannedDate = new DateOnly(2024, 9, 19), PlannedTime = new TimeOnly(9, 0)                    },
            new StopActivity { TripStopId = stopBangkok.Id, CityActivityId = actFloating.Id,    PlannedDate = new DateOnly(2024, 9, 20), PlannedTime = new TimeOnly(7, 0)                    },
            new StopActivity { TripStopId = stopMumbai.Id,  CityActivityId = actGateway.Id,     PlannedDate = new DateOnly(2024, 12, 21), PlannedTime = new TimeOnly(10, 0)                  },
            new StopActivity { TripStopId = stopGoa.Id,     CityActivityId = actBaga.Id,        PlannedDate = new DateOnly(2024, 12, 24), PlannedTime = new TimeOnly(17, 30)                 }
        );

        // ── 10. Budget Expenses ───────────────────────────────────────────────

        await context.BudgetExpenses.AddRangeAsync(
            new BudgetExpense { TripId = euroTrip.Id, Label = "Return Flights",          Category = ExpenseCategory.Transport,      Amount = 1200m, CurrencyCode = "INR", IsEstimate = false, ExpenseDate = new DateOnly(2024, 7, 1)  },
            new BudgetExpense { TripId = euroTrip.Id, Label = "Hotel in Paris (5 nights)",Category = ExpenseCategory.Accommodation, Amount = 900m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 7, 1), TripStopId = stopParis.Id },
            new BudgetExpense { TripId = euroTrip.Id, Label = "Hotel in Rome (4 nights)", Category = ExpenseCategory.Accommodation, Amount = 700m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 7, 6), TripStopId = stopRome.Id  },
            new BudgetExpense { TripId = euroTrip.Id, Label = "Meals budget",             Category = ExpenseCategory.Meals,         Amount = 600m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 7, 1)  },
            new BudgetExpense { TripId = euroTrip.Id, Label = "Activities & Tickets",     Category = ExpenseCategory.Activities,    Amount = 300m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 7, 1)  },

            new BudgetExpense { TripId = asiaTrip.Id, Label = "Flights to Tokyo",         Category = ExpenseCategory.Transport,      Amount = 900m,  CurrencyCode = "INR", IsEstimate = false, ExpenseDate = new DateOnly(2024, 9, 10) },
            new BudgetExpense { TripId = asiaTrip.Id, Label = "Japan Rail Pass",          Category = ExpenseCategory.Transport,      Amount = 300m,  CurrencyCode = "INR", IsEstimate = false, ExpenseDate = new DateOnly(2024, 9, 10) },
            new BudgetExpense { TripId = asiaTrip.Id, Label = "Hotel Tokyo (5 nights)",   Category = ExpenseCategory.Accommodation, Amount = 700m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 9, 10), TripStopId = stopTokyo.Id },
            new BudgetExpense { TripId = asiaTrip.Id, Label = "Meals & Street Food",      Category = ExpenseCategory.Meals,         Amount = 500m,  CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 9, 10) },

            new BudgetExpense { TripId = indiaTrip.Id, Label = "Domestic Flights",        Category = ExpenseCategory.Transport,      Amount = 8000m, CurrencyCode = "INR", IsEstimate = false, ExpenseDate = new DateOnly(2024, 12, 20) },
            new BudgetExpense { TripId = indiaTrip.Id, Label = "Goa Beach Resort",        Category = ExpenseCategory.Accommodation, Amount = 25000m,CurrencyCode = "INR", IsEstimate = true,  ExpenseDate = new DateOnly(2024, 12, 23), TripStopId = stopGoa.Id }
        );

        // ── 11. Packing Items ─────────────────────────────────────────────────

        await context.PackingItems.AddRangeAsync(
            new PackingItem { TripId = euroTrip.Id, Name = "Passport",          Category = PackingCategory.Documents,    IsPacked = true,  SortOrder = 0 },
            new PackingItem { TripId = euroTrip.Id, Name = "Travel Insurance",  Category = PackingCategory.Documents,    IsPacked = true,  SortOrder = 1 },
            new PackingItem { TripId = euroTrip.Id, Name = "Camera",            Category = PackingCategory.Electronics,  IsPacked = false, SortOrder = 2 },
            new PackingItem { TripId = euroTrip.Id, Name = "Power Adapter",     Category = PackingCategory.Electronics,  IsPacked = false, SortOrder = 3 },
            new PackingItem { TripId = euroTrip.Id, Name = "Sunscreen",         Category = PackingCategory.Toiletries,   IsPacked = false, SortOrder = 4 },
            new PackingItem { TripId = euroTrip.Id, Name = "Light Jacket",      Category = PackingCategory.Clothing,     IsPacked = false, SortOrder = 5 },

            new PackingItem { TripId = asiaTrip.Id, Name = "Passport",          Category = PackingCategory.Documents,    IsPacked = false, SortOrder = 0 },
            new PackingItem { TripId = asiaTrip.Id, Name = "IC Suica Card",     Category = PackingCategory.Documents,    IsPacked = false, SortOrder = 1 },
            new PackingItem { TripId = asiaTrip.Id, Name = "Portable Charger",  Category = PackingCategory.Electronics,  IsPacked = false, SortOrder = 2 },
            new PackingItem { TripId = asiaTrip.Id, Name = "Chopstick Etiquette Notes", Category = PackingCategory.Other, IsPacked = false, SortOrder = 3 },

            new PackingItem { TripId = indiaTrip.Id, Name = "Passport",         Category = PackingCategory.Documents,    IsPacked = false, SortOrder = 0 },
            new PackingItem { TripId = indiaTrip.Id, Name = "Mosquito Repellent",Category = PackingCategory.Medicines,   IsPacked = false, SortOrder = 1 },
            new PackingItem { TripId = indiaTrip.Id, Name = "Sunscreen SPF 50", Category = PackingCategory.Toiletries,   IsPacked = false, SortOrder = 2 },
            new PackingItem { TripId = indiaTrip.Id, Name = "Light Linen Shirt",Category = PackingCategory.Clothing,     IsPacked = false, SortOrder = 3 }
        );

        // ── 12. Trip Notes ────────────────────────────────────────────────────

        await context.TripNotes.AddRangeAsync(
            new TripNote { TripId = euroTrip.Id, Title = "Flight Details",      Content = "Outbound: AI202 on Jul 1 at 08:00. Return: AI203 on Jul 14 at 22:00.", NoteDate = new DateOnly(2024, 7, 1)  },
            new TripNote { TripId = euroTrip.Id, Title = "Paris Hotel",         Content = "Hotel Le Marais, confirmation #LM99234. Check-in from 3PM.", NoteDate = new DateOnly(2024, 7, 1), TripStopId = stopParis.Id },
            new TripNote { TripId = euroTrip.Id, Title = "Eiffel Tower Tickets",Content = "Pre-booked tickets for July 2nd at 10AM. Print QR code.", NoteDate = new DateOnly(2024, 7, 2), TripStopId = stopParis.Id },
            new TripNote { TripId = euroTrip.Id, Title = "Rome Hotel",          Content = "Hotel Colosseo View, confirmation #CV55123. Near Termini station.", NoteDate = new DateOnly(2024, 7, 6), TripStopId = stopRome.Id },
            new TripNote { TripId = euroTrip.Id, Title = "Vatican Dress Code",  Content = "No shorts or sleeveless tops allowed inside Vatican Museums.", NoteDate = new DateOnly(2024, 7, 8), TripStopId = stopRome.Id },

            new TripNote { TripId = asiaTrip.Id, Title = "Japan SIM Card",      Content = "Buy IIJmio SIM at Narita airport. Valid for 15 days.", NoteDate = new DateOnly(2024, 9, 10) },
            new TripNote { TripId = asiaTrip.Id, Title = "Tokyo Airbnb",        Content = "Check-in code: 4821. Host: Yuki. Near Shinjuku station.", NoteDate = new DateOnly(2024, 9, 10), TripStopId = stopTokyo.Id },
            new TripNote { TripId = asiaTrip.Id, Title = "Fushimi Inari Tips",  Content = "Start at 6AM to beat the crowds. Bring water.", NoteDate = new DateOnly(2024, 9, 16), TripStopId = stopKyoto.Id },

            new TripNote { TripId = indiaTrip.Id, Title = "Goa Beach Shack",    Content = "Brittos Beach Shack, Baga. Table reserved Dec 25 at 7PM.", NoteDate = new DateOnly(2024, 12, 23), TripStopId = stopGoa.Id },
            new TripNote { TripId = indiaTrip.Id, Title = "Mumbai Contacts",    Content = "Local contact: Ravi +91-98765-43210. Can help with taxi booking.", NoteDate = new DateOnly(2024, 12, 20) }
        );

        // ── 13. Trip Shares ───────────────────────────────────────────────────

        await context.TripShares.AddRangeAsync(
            new TripShare { TripId = euroTrip.Id, SharedWithEmail = "friend@example.com", Permission = SharePermission.CanCopy,   SharedAt = DateTime.UtcNow },
            new TripShare { TripId = asiaTrip.Id, SharedWithEmail = "friend@example.com", Permission = SharePermission.ReadOnly,  SharedAt = DateTime.UtcNow }
        );

        await context.SaveChangesAsync();
    }
}