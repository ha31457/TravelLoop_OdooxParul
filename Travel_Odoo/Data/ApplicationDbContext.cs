using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Models;

namespace Travel_Odoo.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options) {

        // ── DbSets ───────────────────────────────────────────────────────────
        public DbSet<User> Users => Set<User>();
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
        public DbSet<Country> Countries => Set<Country>();
        public DbSet<City> Cities => Set<City>();
        public DbSet<CityActivity> CityActivities => Set<CityActivity>();
        public DbSet<ActivityImage> ActivityImages => Set<ActivityImage>();
        public DbSet<Trip> Trips => Set<Trip>();
        public DbSet<TripStop> TripStops => Set<TripStop>();
        public DbSet<StopActivity> StopActivities => Set<StopActivity>();
        public DbSet<BudgetExpense> BudgetExpenses => Set<BudgetExpense>();
        public DbSet<PackingItem> PackingItems => Set<PackingItem>();
        public DbSet<TripNote> TripNotes => Set<TripNote>();
        public DbSet<SavedDestination> SavedDestinations => Set<SavedDestination>();
        public DbSet<TripShare> TripShares => Set<TripShare>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Default schema ────────────────────────────────────────────────
            modelBuilder.HasDefaultSchema("traveloop");

            // ════════════════════════════════════════════════════════════════
            // USER
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<User>(e =>
            {
                e.ToTable("Users");

                e.HasIndex(u => u.Email)
                    .IsUnique()
                    .HasDatabaseName("UQ_Users_Email");

                e.Property(u => u.FullName).HasMaxLength(100).IsRequired();
                e.Property(u => u.Email).HasMaxLength(255).IsRequired();
                e.Property(u => u.PasswordHash).IsRequired();
                e.Property(u => u.LanguagePreference).HasMaxLength(10).HasDefaultValue("en");
                e.Property(u => u.IsActive).HasDefaultValue(true);
                e.Property(u => u.IsAdmin).HasDefaultValue(false);
                e.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Soft-delete filter — queries automatically exclude inactive users
                e.HasQueryFilter(u => u.IsActive);
            });

            // ════════════════════════════════════════════════════════════════
            // PASSWORD RESET TOKEN
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<PasswordResetToken>(e =>
            {
                e.ToTable("PasswordResetTokens");

                e.HasIndex(t => t.Token)
                    .IsUnique()
                    .HasDatabaseName("UQ_PasswordResetTokens_Token");

                e.HasIndex(t => new { t.UserId, t.IsUsed })
                    .HasDatabaseName("IX_PasswordResetTokens_UserId_IsUsed");

                e.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // ════════════════════════════════════════════════════════════════
            // COUNTRY
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<Country>(e =>
            {
                e.ToTable("Countries");

                e.HasIndex(c => c.IsoCode)
                    .IsUnique()
                    .HasDatabaseName("UQ_Countries_IsoCode");

                e.Property(c => c.Name).HasMaxLength(100).IsRequired();
                e.Property(c => c.IsoCode).HasMaxLength(3).IsRequired().IsFixedLength();
                e.Property(c => c.Region).HasMaxLength(100);
            });

            // ════════════════════════════════════════════════════════════════
            // CITY
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<City>(e =>
            {
                e.ToTable("Cities");

                // Composite unique: city name is unique within a country
                e.HasIndex(c => new { c.CountryId, c.Name })
                    .IsUnique()
                    .HasDatabaseName("UQ_Cities_CountryId_Name");

                // Filtered index for fast popularity-ranked queries
                e.HasIndex(c => c.PopularityScore)
                    .HasDatabaseName("IX_Cities_PopularityScore");

                e.Property(c => c.Name).HasMaxLength(100).IsRequired();
                e.Property(c => c.Region).HasMaxLength(100);
                e.Property(c => c.Latitude).HasColumnType("decimal(9,6)");
                e.Property(c => c.Longitude).HasColumnType("decimal(9,6)");
                e.Property(c => c.PopularityScore).HasDefaultValue(0);

                e.HasOne(c => c.Country)
                    .WithMany(co => co.Cities)
                    .HasForeignKey(c => c.CountryId)
                    .OnDelete(DeleteBehavior.Restrict); // never cascade-delete a country
            });

            // ════════════════════════════════════════════════════════════════
            // CITY ACTIVITY
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<CityActivity>(e =>
            {
                e.ToTable("CityActivities");

                e.HasIndex(a => a.CityId)
                    .HasDatabaseName("IX_CityActivities_CityId");

                // Index supporting category-filtered search within a city
                e.HasIndex(a => new { a.CityId, a.Category })
                    .HasDatabaseName("IX_CityActivities_CityId_Category");

                e.Property(a => a.Name).HasMaxLength(150).IsRequired();
                e.Property(a => a.Description).HasMaxLength(1000);
                e.Property(a => a.EstimatedCost).HasColumnType("decimal(18,2)");
                e.Property(a => a.Category)
                    .HasConversion<string>()
                    .HasMaxLength(30);
                e.Property(a => a.PopularityScore).HasDefaultValue(0);

                e.HasOne(a => a.City)
                    .WithMany(c => c.Activities)
                    .HasForeignKey(a => a.CityId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ════════════════════════════════════════════════════════════════
            // ACTIVITY IMAGE
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<ActivityImage>(e =>
            {
                e.ToTable("ActivityImages");

                e.HasIndex(i => i.CityActivityId)
                    .HasDatabaseName("IX_ActivityImages_CityActivityId");

                e.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
                e.Property(i => i.IsPrimary).HasDefaultValue(false);
                e.Property(i => i.SortOrder).HasDefaultValue(0);

                e.HasOne(i => i.CityActivity)
                    .WithMany(a => a.Images)
                    .HasForeignKey(i => i.CityActivityId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ════════════════════════════════════════════════════════════════
            // TRIP
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<Trip>(e =>
            {
                e.ToTable("Trips");

                e.HasIndex(t => t.UserId)
                    .HasDatabaseName("IX_Trips_UserId");

                // Unique filtered index — public slug must be unique when set
                e.HasIndex(t => t.PublicSlug)
                    .IsUnique()
                    .HasFilter("[PublicSlug] IS NOT NULL")
                    .HasDatabaseName("UQ_Trips_PublicSlug");

                // Composite index for dashboard queries (user + status)
                e.HasIndex(t => new { t.UserId, t.Status })
                    .HasDatabaseName("IX_Trips_UserId_Status");

                e.Property(t => t.Name).HasMaxLength(150).IsRequired();
                e.Property(t => t.Description).HasMaxLength(1000);
                e.Property(t => t.CoverPhotoUrl).HasMaxLength(500);
                e.Property(t => t.PublicSlug).HasMaxLength(128);
                e.Property(t => t.TotalBudget).HasColumnType("decimal(18,2)");
                e.Property(t => t.CurrencyCode)
                    .HasMaxLength(3)
                    .IsFixedLength()
                    .HasDefaultValue("USD");
                e.Property(t => t.Status)
                    .HasConversion<string>()
                    .HasMaxLength(20);
                e.Property(t => t.IsPublic).HasDefaultValue(false);
                e.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Check: end date must be >= start date
                e.ToTable(tb => tb.HasCheckConstraint(
                    "CK_Trips_DateRange",
                    "[EndDate] >= [StartDate]"));

                e.HasOne(t => t.User)
                    .WithMany(u => u.Trips)
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ════════════════════════════════════════════════════════════════
            // TRIP STOP
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<TripStop>(e =>
            {
                e.ToTable("TripStops");

                e.HasIndex(s => s.TripId)
                    .HasDatabaseName("IX_TripStops_TripId");

                // Ordered stop retrieval per trip
                e.HasIndex(s => new { s.TripId, s.OrderIndex })
                    .HasDatabaseName("IX_TripStops_TripId_OrderIndex");

                e.Property(s => s.Notes).HasMaxLength(500);
                e.Property(s => s.OrderIndex).HasDefaultValue(0);

                e.ToTable(tb => tb.HasCheckConstraint(
                    "CK_TripStops_DateRange",
                    "[DepartureDate] >= [ArrivalDate]"));

                e.HasOne(s => s.Trip)
                    .WithMany(t => t.Stops)
                    .HasForeignKey(s => s.TripId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(s => s.City)
                    .WithMany(c => c.TripStops)
                    .HasForeignKey(s => s.CityId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ════════════════════════════════════════════════════════════════
            // STOP ACTIVITY
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<StopActivity>(e =>
            {
                e.ToTable("StopActivities");

                // Prevent the same activity being added twice to the same stop
                e.HasIndex(sa => new { sa.TripStopId, sa.CityActivityId })
                    .IsUnique()
                    .HasDatabaseName("UQ_StopActivities_Stop_Activity");

                e.HasIndex(sa => sa.TripStopId)
                    .HasDatabaseName("IX_StopActivities_TripStopId");

                e.Property(sa => sa.ActualCost).HasColumnType("decimal(18,2)");
                e.Property(sa => sa.Notes).HasMaxLength(500);
                e.Property(sa => sa.IsCompleted).HasDefaultValue(false);

                e.HasOne(sa => sa.TripStop)
                    .WithMany(s => s.StopActivities)
                    .HasForeignKey(sa => sa.TripStopId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(sa => sa.CityActivity)
                    .WithMany(a => a.StopActivities)
                    .HasForeignKey(sa => sa.CityActivityId)
                    .OnDelete(DeleteBehavior.Restrict); // keep catalogue record
            });

            // ════════════════════════════════════════════════════════════════
            // BUDGET EXPENSE
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<BudgetExpense>(e =>
            {
                e.ToTable("BudgetExpenses");

                e.HasIndex(b => b.TripId)
                    .HasDatabaseName("IX_BudgetExpenses_TripId");

                e.HasIndex(b => new { b.TripId, b.Category })
                    .HasDatabaseName("IX_BudgetExpenses_TripId_Category");

                e.Property(b => b.Label).HasMaxLength(150).IsRequired();
                e.Property(b => b.Amount).HasColumnType("decimal(18,2)").IsRequired();
                e.Property(b => b.CurrencyCode)
                    .HasMaxLength(3)
                    .IsFixedLength()
                    .HasDefaultValue("USD");
                e.Property(b => b.Category)
                    .HasConversion<string>()
                    .HasMaxLength(30);
                e.Property(b => b.IsEstimate).HasDefaultValue(true);

                e.ToTable(tb => tb.HasCheckConstraint(
                    "CK_BudgetExpenses_AmountPositive",
                    "[Amount] >= 0"));

                e.HasOne(b => b.Trip)
                    .WithMany()
                    .HasForeignKey(b => b.TripId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(b => b.TripStop)
                    .WithMany()
                    .HasForeignKey(b => b.TripStopId)
                    .OnDelete(DeleteBehavior.NoAction); // trip-level delete handled by Trip cascade
            });

            // ════════════════════════════════════════════════════════════════
            // PACKING ITEM
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<PackingItem>(e =>
            {
                e.ToTable("PackingItems");

                e.HasIndex(p => p.TripId)
                    .HasDatabaseName("IX_PackingItems_TripId");

                e.Property(p => p.Name).HasMaxLength(150).IsRequired();
                e.Property(p => p.Category)
                    .HasConversion<string>()
                    .HasMaxLength(20);
                e.Property(p => p.IsPacked).HasDefaultValue(false);
                e.Property(p => p.SortOrder).HasDefaultValue(0);

                e.HasOne(p => p.Trip)
                    .WithMany(t => t.PackingItems)
                    .HasForeignKey(p => p.TripId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ════════════════════════════════════════════════════════════════
            // TRIP NOTE
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<TripNote>(e =>
            {
                e.ToTable("TripNotes");

                e.HasIndex(n => n.TripId)
                    .HasDatabaseName("IX_TripNotes_TripId");

                // Index for stop-specific note retrieval
                e.HasIndex(n => n.TripStopId)
                    .HasFilter("[TripStopId] IS NOT NULL")
                    .HasDatabaseName("IX_TripNotes_TripStopId");

                e.Property(n => n.Title).HasMaxLength(200).IsRequired();
                e.Property(n => n.Content).IsRequired();
                e.Property(n => n.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(n => n.Trip)
                    .WithMany(t => t.Notes)
                    .HasForeignKey(n => n.TripId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(n => n.TripStop)
                    .WithMany(s => s.Notes_)
                    .HasForeignKey(n => n.TripStopId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            // ════════════════════════════════════════════════════════════════
            // SAVED DESTINATION
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<SavedDestination>(e =>
            {
                e.ToTable("SavedDestinations");

                // A user can only save a city once
                e.HasIndex(sd => new { sd.UserId, sd.CityId })
                    .IsUnique()
                    .HasDatabaseName("UQ_SavedDestinations_User_City");

                e.Property(sd => sd.SavedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(sd => sd.User)
                    .WithMany(u => u.SavedDestinations)
                    .HasForeignKey(sd => sd.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(sd => sd.City)
                    .WithMany(c => c.SavedByUsers)
                    .HasForeignKey(sd => sd.CityId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ════════════════════════════════════════════════════════════════
            // TRIP SHARE
            // ════════════════════════════════════════════════════════════════
            modelBuilder.Entity<TripShare>(e =>
            {
                e.ToTable("TripShares");

                // A trip can be shared to the same email only once
                e.HasIndex(ts => new { ts.TripId, ts.SharedWithEmail })
                    .IsUnique()
                    .HasDatabaseName("UQ_TripShares_Trip_Email");

                e.Property(ts => ts.SharedWithEmail).HasMaxLength(255).IsRequired();
                e.Property(ts => ts.Permission)
                    .HasConversion<string>()
                    .HasMaxLength(20);
                e.Property(ts => ts.SharedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(ts => ts.Trip)
                    .WithMany()
                    .HasForeignKey(ts => ts.TripId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        // ── Audit: auto-stamp UpdatedAt on SaveChanges ───────────────────────
        public override int SaveChanges()
        {
            StampAuditFields();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            StampAuditFields();
            return base.SaveChangesAsync(ct);
        }

        private void StampAuditFields()
        {
            var now = DateTime.UtcNow;
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Modified)
                {
                    var prop = entry.Properties
                        .FirstOrDefault(p => p.Metadata.Name == "UpdatedAt");
                    if (prop != null)
                        prop.CurrentValue = now;
                }
            }
        }
    }


