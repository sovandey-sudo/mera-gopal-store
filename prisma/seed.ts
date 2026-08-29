import { PrismaClient, Role, DiscountType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ======================
  // 1. Admin Users (LOCAL DEVELOPMENT ONLY)
  // ======================
  const passwordHash = await hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@devotionalstore.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@devotionalstore.com",
      passwordHash,
      role: Role.SUPER_ADMIN,
      phone: "+91-9999999999",
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@devotionalstore.com" },
    update: {},
    create: {
      name: "Store Manager",
      email: "manager@devotionalstore.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin users created (LOCAL DEVELOPMENT ONLY)");
  console.log("  Email: admin@devotionalstore.com");
  console.log("  Password: Admin@12345");
  console.log("  (LOCAL DEVELOPMENT ONLY — never use in production)");

  // ======================
  // 2. Categories (business catalogue)
  // ======================
  const categoriesData = [
    { name: "Laddu Gopal", slug: "laddu-gopal", description: "Offerings, dresses and items for Laddu Gopal Ji", displayOrder: 1 },
    { name: "Radha Rani", slug: "radha-rani", description: "Attire and ornaments for Radha Rani", displayOrder: 2 },
    { name: "Dresses", slug: "dresses", description: "Devotional dresses for deities", displayOrder: 3 },
    { name: "Ornaments", slug: "ornaments", description: "Traditional spiritual ornaments", displayOrder: 4 },
    { name: "Mala", slug: "mala", description: "Sacred malas including Kuch Mala", displayOrder: 5 },
    { name: "Gomti Chakra", slug: "gomti-chakra", description: "Natural Gomti Chakra items", displayOrder: 6 },
    { name: "Narmadeshwar Shivlinga", slug: "narmadeshwar-shivlinga", description: "Narmadeshwar Shivlingas", displayOrder: 7 },
    { name: "Puja Items", slug: "puja-items", description: "Essential daily puja products", displayOrder: 8 },
    { name: "Spathik Mala", slug: "spathik-mala", description: "Spathik (crystal) malas", displayOrder: 9 },
    { name: "Astagandha Chandan", slug: "astagandha-chandan", description: "Astagandha Chandan and sacred pastes", displayOrder: 10 },
    { name: "Gemstones", slug: "gemstones", description: "Gemstones with optional certificate disclosure", displayOrder: 11 },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: true,
      },
    });
    categories[cat.slug] = created.id;
  }

  console.log("✅ Categories created");

  // ======================
  // 3. Realistic product catalogue
  // Descriptions are illustrative store copy only — not scientific/medical claims.
  // ======================
  const products = [
    // Laddu Gopal
    {
      sku: "LG-LADDU-001",
      name: "Laddu Gopal Coconut Laddu - Pack of 12",
      slug: "laddu-gopal-coconut-laddu-pack-12",
      shortDescription: "Fresh coconut laddus prepared for offering",
      fullDescription:
        "Soft coconut laddus packed for temple and home offerings. Store in a cool place and use as per your tradition. Pack of 12.",
      categorySlug: "laddu-gopal",
      price: 249,
      compareAtPrice: 299,
      stockQuantity: 100,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
      weight: 250,
    },
    {
      sku: "LG-DRESS-001",
      name: "Laddu Gopal Designer Dress - Maroon Velvet",
      slug: "laddu-gopal-maroon-velvet-dress",
      shortDescription: "Maroon velvet dress for Laddu Gopal Ji",
      fullDescription:
        "Velvet dress with golden embroidery for special occasions. Suitable for approximately 2–4 inch Laddu Gopal murti. Hand wash recommended.",
      categorySlug: "laddu-gopal",
      price: 899,
      compareAtPrice: 1199,
      stockQuantity: 25,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    {
      sku: "LG-DRESS-002",
      name: "Laddu Gopal Cotton Dress - Yellow",
      slug: "laddu-gopal-cotton-dress-yellow",
      shortDescription: "Light yellow cotton dress for daily wear",
      fullDescription:
        "Breathable cotton dress for everyday shringar. Simple design suitable for regular seva.",
      categorySlug: "laddu-gopal",
      price: 399,
      stockQuantity: 40,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    // Radha Rani
    {
      sku: "RR-LEH-001",
      name: "Radha Rani Lehenga Set - Peach Gold",
      slug: "radha-rani-peach-gold-lehenga",
      shortDescription: "Peach and gold lehenga set for Radha Rani",
      fullDescription:
        "Traditional lehenga set with detailed work for festivals and special pujas. Check size notes before ordering.",
      categorySlug: "radha-rani",
      price: 1499,
      compareAtPrice: 1899,
      stockQuantity: 15,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    {
      sku: "RR-DRESS-001",
      name: "Radha Rani Silk Dress - Royal Blue",
      slug: "radha-rani-silk-dress-royal-blue",
      shortDescription: "Royal blue silk dress for Radha Rani",
      fullDescription:
        "Silk blend dress for festival shringar. Dry clean preferred.",
      categorySlug: "radha-rani",
      price: 1299,
      stockQuantity: 12,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    // Dresses
    {
      sku: "DRS-SET-001",
      name: "Festival Dress Combo - Deity Pair",
      slug: "festival-dress-combo-deity-pair",
      shortDescription: "Matching pair set for festival occasions",
      fullDescription:
        "Coordinated dress set intended for paired deity murtis. Colours and sizes as listed on the product.",
      categorySlug: "dresses",
      price: 1899,
      compareAtPrice: 2299,
      stockQuantity: 10,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    // Ornaments
    {
      sku: "ORN-MUKUT-001",
      name: "Laddu Gopal Mukut - Golden Finish",
      slug: "laddu-gopal-mukut-golden",
      shortDescription: "Decorative mukut for Laddu Gopal",
      fullDescription:
        "Lightweight decorative crown for murti shringar. Handle with care.",
      categorySlug: "ornaments",
      price: 449,
      stockQuantity: 30,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    {
      sku: "ORN-HAAR-001",
      name: "Pearl Haar for Deity - Medium",
      slug: "pearl-haar-deity-medium",
      shortDescription: "Medium-length decorative pearl haar",
      fullDescription:
        "Decorative haar for deity adornment. Not a precious jewellery item; for shringar use.",
      categorySlug: "ornaments",
      price: 299,
      stockQuantity: 45,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    // Mala
    {
      sku: "MALA-KUCH-001",
      name: "Kuch Mala - Premium Quality",
      slug: "kuch-mala-premium",
      shortDescription: "Kuch Mala for japa and decoration",
      fullDescription:
        "Hand-strung Kuch Mala for japa or offering. Keep dry and clean.",
      categorySlug: "mala",
      price: 349,
      stockQuantity: 50,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    {
      sku: "MALA-TULSI-001",
      name: "Tulsi Mala - 108 Beads",
      slug: "tulsi-mala-108",
      shortDescription: "Traditional Tulsi mala with 108 beads",
      fullDescription:
        "Tulsi bead mala commonly used for japa. Natural variations in bead size may occur.",
      categorySlug: "mala",
      price: 199,
      stockQuantity: 60,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    // Gomti Chakra
    {
      sku: "GOMTI-001",
      name: "Gomti Chakra - Natural Set of 11",
      slug: "gomti-chakra-set-11",
      shortDescription: "Natural Gomti Chakra set of 11",
      fullDescription:
        "Natural Gomti Chakras sold as traditional items. Appearance may vary as these are natural pieces.",
      categorySlug: "gomti-chakra",
      price: 199,
      stockQuantity: 80,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    // Narmadeshwar Shivlinga
    {
      sku: "SHIV-NARMADA-001",
      name: "Narmadeshwar Shivlinga - Medium",
      slug: "narmadeshwar-shivlinga-medium",
      shortDescription: "Narmadeshwar Shivlinga (medium size)",
      fullDescription:
        "Shivlinga sold for traditional worship. Size and natural markings vary by piece. Handle with care.",
      categorySlug: "narmadeshwar-shivlinga",
      price: 1299,
      compareAtPrice: 1599,
      stockQuantity: 8,
      isFeatured: true,
      isBundleEligible: false,
      productType: "physical",
      weight: 500,
    },
    {
      sku: "SHIV-NARMADA-002",
      name: "Narmadeshwar Shivlinga - Small",
      slug: "narmadeshwar-shivlinga-small",
      shortDescription: "Small Narmadeshwar Shivlinga for home altar",
      fullDescription:
        "Compact size suitable for home puja. Natural stone characteristics will vary.",
      categorySlug: "narmadeshwar-shivlinga",
      price: 699,
      stockQuantity: 14,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
      weight: 200,
    },
    // Puja Items
    {
      sku: "PUJA-DIYA-001",
      name: "Brass Diya - Pair",
      slug: "brass-diya-pair",
      shortDescription: "Traditional brass diya pair",
      fullDescription:
        "Brass diyas for daily or festival lighting. Clean with appropriate metal cleaner.",
      categorySlug: "puja-items",
      price: 449,
      stockQuantity: 35,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
    },
    {
      sku: "PUJA-THALI-001",
      name: "Puja Thali Set - Basic",
      slug: "puja-thali-set-basic",
      shortDescription: "Basic puja thali set for home use",
      fullDescription:
        "Includes thali and common small accessories as listed in the pack contents on dispatch.",
      categorySlug: "puja-items",
      price: 799,
      stockQuantity: 20,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    // Spathik Mala
    {
      sku: "SPATHIK-MALA-001",
      name: "Spathik Mala - 108 Beads",
      slug: "spathik-mala-108",
      shortDescription: "Clear Spathik (crystal) mala, 108 beads",
      fullDescription:
        "Spathik bead mala for traditional use. Beads may show natural variation. Not a medical device.",
      categorySlug: "spathik-mala",
      price: 599,
      stockQuantity: 28,
      isFeatured: true,
      isBundleEligible: true,
      productType: "physical",
    },
    // Astagandha Chandan
    {
      sku: "CHANDAN-ASTA-001",
      name: "Astagandha Chandan Paste - 50g",
      slug: "astagandha-chandan-paste-50g",
      shortDescription: "Astagandha chandan paste, 50g jar",
      fullDescription:
        "Chandan paste for traditional tilak and puja use. For external traditional use only. Check ingredients on label.",
      categorySlug: "astagandha-chandan",
      price: 175,
      stockQuantity: 55,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
      weight: 50,
    },
    {
      sku: "CHANDAN-ASTA-002",
      name: "Astagandha Chandan Powder - 100g",
      slug: "astagandha-chandan-powder-100g",
      shortDescription: "Astagandha chandan powder, 100g",
      fullDescription:
        "Powder form for mixing as per traditional practice. Store in a dry place.",
      categorySlug: "astagandha-chandan",
      price: 225,
      stockQuantity: 40,
      isFeatured: false,
      isBundleEligible: true,
      productType: "physical",
      weight: 100,
    },
    // Gemstones — no invented lab numbers or medical claims
    {
      sku: "GEM-YEL-SAP-001",
      name: "Yellow Sapphire - 2.5 Carat",
      slug: "yellow-sapphire-2-5-carat",
      shortDescription: "Yellow sapphire, approx. 2.5 carat",
      fullDescription:
        "Yellow sapphire offered as a gemstone product. Weight is approximate as listed. Optional certificate may be requested where available; certificate details are disclosed at purchase and are not generated by this website.",
      categorySlug: "gemstones",
      price: 12500,
      compareAtPrice: 15000,
      stockQuantity: 3,
      isFeatured: true,
      isBundleEligible: false,
      productType: "gemstone",
      weight: 2.5,
      certificateAvailable: true,
      certificateFee: 1500,
      certificateProvider: null,
      certificateDisclosure:
        "Certificate is optional and provided only when arranged by the seller. This website does not issue laboratory certificates or invent certificate numbers. Verify any document directly with the issuing laboratory.",
    },
    {
      sku: "GEM-EMR-001",
      name: "Emerald - 1.8 Carat",
      slug: "emerald-1-8-carat",
      shortDescription: "Emerald, approx. 1.8 carat",
      fullDescription:
        "Emerald gemstone as listed by weight. Colour and inclusions are natural characteristics. No medical or guaranteed outcome claims are made.",
      categorySlug: "gemstones",
      price: 18000,
      stockQuantity: 2,
      isFeatured: true,
      isBundleEligible: false,
      productType: "gemstone",
      weight: 1.8,
      certificateAvailable: true,
      certificateFee: 2000,
      certificateDisclosure:
        "Optional certificate fee applies only if you request a certificate and one can be arranged. No certificate number is created by this store.",
    },
    {
      sku: "GEM-SPATHIK-001",
      name: "Spathik Stone - Natural Piece",
      slug: "spathik-stone-natural",
      shortDescription: "Natural spathik (clear quartz) piece",
      fullDescription:
        "Natural clear quartz piece for traditional or decorative use. Size varies by piece.",
      categorySlug: "gemstones",
      price: 399,
      stockQuantity: 22,
      isFeatured: false,
      isBundleEligible: true,
      productType: "gemstone",
      weight: 25,
      certificateAvailable: false,
    },
  ];

  for (const p of products) {
    const categoryId = categories[p.categorySlug];
    if (!categoryId) {
      console.warn(`Skipping product ${p.sku}: category ${p.categorySlug} missing`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stockQuantity: p.stockQuantity,
        isFeatured: p.isFeatured,
        isBundleEligible: p.isBundleEligible,
        isActive: true,
        productType: p.productType,
        weight: p.weight ?? null,
        certificateAvailable: p.certificateAvailable ?? false,
        certificateFee: p.certificateFee ?? null,
        certificateProvider: p.certificateProvider ?? null,
        certificateDisclosure: p.certificateDisclosure ?? null,
        categoryId,
      },
      create: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stockQuantity: p.stockQuantity,
        isFeatured: p.isFeatured,
        isBundleEligible: p.isBundleEligible,
        isActive: true,
        productType: p.productType,
        weight: p.weight ?? null,
        certificateAvailable: p.certificateAvailable ?? false,
        certificateFee: p.certificateFee ?? null,
        certificateProvider: p.certificateProvider ?? null,
        certificateDisclosure: p.certificateDisclosure ?? null,
        categoryId,
      },
    });
  }

  console.log(`✅ ${products.length} products seeded`);

  // ======================
  // 3b. Product images (placeholder SVGs — replace via Admin with real photos)
  // ======================
  for (const p of products) {
    const product = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!product) continue;

    const imageUrl = `/images/products/${p.slug}.svg`;
    const existing = await prisma.productImage.findFirst({
      where: { productId: product.id, isPrimary: true },
    });

    if (!existing) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl,
          altText: p.name,
          isPrimary: true,
          displayOrder: 0,
        },
      });
    } else if (existing.imageUrl.includes("placeholder") || existing.imageUrl.endsWith(".svg")) {
      await prisma.productImage.update({
        where: { id: existing.id },
        data: { imageUrl, altText: p.name },
      });
    }
  }

  console.log("✅ Product placeholder images linked");


  // ======================
  // 4. Bundle offer (5-item savings)
  // ======================
  const existingBundle = await prisma.bundleOffer.findFirst({
    where: { name: "5-Item Transportation Savings" },
  });

  if (!existingBundle) {
    await prisma.bundleOffer.create({
      data: {
        name: "5-Item Transportation Savings",
        message:
          "Save on transportation when you order 5 or more eligible items in a single order.",
        minimumQuantity: 5,
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 100,
        isActive: true,
      },
    });
  } else {
    await prisma.bundleOffer.update({
      where: { id: existingBundle.id },
      data: {
        minimumQuantity: 5,
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 100,
        isActive: true,
      },
    });
  }

  console.log("✅ Bundle offer configured");

  // ======================
  // 5. Gemstone rules (traditional associations only)
  // ======================
  const gemstoneRules = [
    {
      name: "Jupiter - Yellow Sapphire",
      planet: "Jupiter",
      recommendedGemstone: "Yellow Sapphire",
      alternativeGemstone: "Pukhraj",
      favorableConditions: "As per traditional association with Jupiter",
      explanation:
        "In traditional Vedic associations, Yellow Sapphire (Pukhraj) is linked with Jupiter. Suitability depends on a full chart reading by a qualified astrologer. This store does not calculate or guarantee outcomes.",
      caution:
        "Not a medical, financial, or guaranteed remedy. Consult a qualified astrologer before purchase or use.",
      displayOrder: 1,
    },
    {
      name: "Mercury - Emerald",
      planet: "Mercury",
      recommendedGemstone: "Emerald",
      alternativeGemstone: "Panna",
      favorableConditions: "As per traditional association with Mercury",
      explanation:
        "Emerald (Panna) is traditionally associated with Mercury. Individual suitability varies. Rules are administrator-configured.",
      caution:
        "Consult a qualified astrologer. Not a substitute for professional advice.",
      displayOrder: 2,
    },
    {
      name: "General - Spathik / Clear Quartz",
      planet: null,
      recommendedGemstone: "Spathik",
      alternativeGemstone: "Clear Quartz",
      favorableConditions: "General traditional or decorative use",
      explanation:
        "Spathik (clear quartz) is commonly used in spiritual contexts and is not treated here as a classical navaratna prescription.",
      caution: "For traditional or decorative use. Not a medical remedy.",
      displayOrder: 3,
    },
  ];

  for (const rule of gemstoneRules) {
    const existing = await prisma.gemstoneRule.findFirst({
      where: { name: rule.name },
    });
    if (!existing) {
      await prisma.gemstoneRule.create({ data: { ...rule, isActive: true } });
    } else {
      await prisma.gemstoneRule.update({
        where: { id: existing.id },
        data: { ...rule, isActive: true },
      });
    }
  }

  console.log("✅ Gemstone rules created");

  // ======================
  // 6. Site settings
  // ======================
  const settings = [
    { key: "store_name", value: "Devotional Store" },
    { key: "currency", value: "INR" },
    { key: "support_email", value: "support@devotionalstore.com" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("✅ Site settings created");
  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
