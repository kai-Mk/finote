import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // 既存データをクリア（開発環境のみ）
    console.log("🗑️  Clearing existing data...");
    await prisma.transaction.deleteMany();
    await prisma.fixedCost.deleteMany();
    await prisma.investment.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.point.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.mainCategory.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.investmentCategory.deleteMany();

    // 1. 支払い方法の作成
    console.log("💳 Creating payment methods...");
    const paymentMethods = await Promise.all([
        prisma.paymentMethod.create({
            data: {
                name: "現金",
                type: "cash",
                description: "現金での支払い",
            },
        }),
        prisma.paymentMethod.create({
            data: {
                name: "楽天カード",
                type: "credit",
                description: "クレジットカード決済",
            },
        }),
        prisma.paymentMethod.create({
            data: {
                name: "PayPay",
                type: "e_money",
                description: "スマホ決済",
            },
        }),
        prisma.paymentMethod.create({
            data: {
                name: "銀行振込",
                type: "bank_transfer",
                description: "口座振替・銀行振込",
            },
        }),
        prisma.paymentMethod.create({
            data: {
                name: "Suica",
                type: "e_money",
                description: "交通系ICカード",
            },
        }),
    ]);

    // 2. 親カテゴリーの作成
    console.log("📂 Creating main categories...");
    const expenseCategories = await Promise.all([
        prisma.mainCategory.create({
            data: { name: "食費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "住居費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "交通費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "通信費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "交際費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "自己投資", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "雑費", type: "expense" },
        }),
        prisma.mainCategory.create({
            data: { name: "投資", type: "expense" },
        }),
    ]);

    const incomeCategories = await Promise.all([
        prisma.mainCategory.create({
            data: { name: "給与", type: "income" },
        }),
        prisma.mainCategory.create({
            data: { name: "副業", type: "income" },
        }),
        prisma.mainCategory.create({
            data: { name: "その他収入", type: "income" },
        }),
    ]);

    // 3. 子カテゴリーの作成
    console.log("📁 Creating sub categories...");
    const subCategories = await Promise.all([
        // 食費の子カテゴリー
        prisma.subCategory.create({
            data: { name: "ラーメン", mainCategoryId: expenseCategories[0].id },
        }),
        prisma.subCategory.create({
            data: { name: "自炊", mainCategoryId: expenseCategories[0].id },
        }),
        prisma.subCategory.create({
            data: { name: "外食", mainCategoryId: expenseCategories[0].id },
        }),
        prisma.subCategory.create({
            data: { name: "コンビニ", mainCategoryId: expenseCategories[0].id },
        }),

        // 自己投資の子カテゴリー
        prisma.subCategory.create({
            data: { name: "書籍", mainCategoryId: expenseCategories[5].id },
        }),
        prisma.subCategory.create({
            data: {
                name: "筋トレグッズ",
                mainCategoryId: expenseCategories[5].id,
            },
        }),
        prisma.subCategory.create({
            data: { name: "セミナー", mainCategoryId: expenseCategories[5].id },
        }),
        prisma.subCategory.create({
            data: {
                name: "オンライン講座",
                mainCategoryId: expenseCategories[5].id,
            },
        }),

        // 交通費の子カテゴリー
        prisma.subCategory.create({
            data: { name: "電車", mainCategoryId: expenseCategories[2].id },
        }),
        prisma.subCategory.create({
            data: { name: "バス", mainCategoryId: expenseCategories[2].id },
        }),
        prisma.subCategory.create({
            data: { name: "タクシー", mainCategoryId: expenseCategories[2].id },
        }),

        // 交際費の子カテゴリー
        prisma.subCategory.create({
            data: { name: "飲み会", mainCategoryId: expenseCategories[4].id },
        }),
        prisma.subCategory.create({
            data: { name: "デート", mainCategoryId: expenseCategories[4].id },
        }),
        prisma.subCategory.create({
            data: {
                name: "プレゼント",
                mainCategoryId: expenseCategories[4].id,
            },
        }),
    ]);

    // 4. 投資カテゴリーの作成
    console.log("📈 Creating investment categories...");
    const investmentCategories = await Promise.all([
        prisma.investmentCategory.create({
            data: {
                name: "NISA",
                description: "つみたてNISA・一般NISA",
            },
        }),
        prisma.investmentCategory.create({
            data: {
                name: "個別株",
                description: "個別株式投資",
            },
        }),
        prisma.investmentCategory.create({
            data: {
                name: "iDeCo",
                description: "個人型確定拠出年金",
            },
        }),
    ]);

    // 5. 固定費の作成
    console.log("🏠 Creating fixed costs...");
    await Promise.all([
        prisma.fixedCost.create({
            data: {
                name: "家賃",
                amount: 80000,
                mainCategoryId: expenseCategories[1].id, // 住居費
                billingDate: 27,
                isActive: true,
            },
        }),
        prisma.fixedCost.create({
            data: {
                name: "携帯代",
                amount: 3000,
                mainCategoryId: expenseCategories[3].id, // 通信費
                billingDate: 10,
                isActive: true,
            },
        }),
        prisma.fixedCost.create({
            data: {
                name: "Netflix",
                amount: 1980,
                mainCategoryId: expenseCategories[6].id, // 雑費
                billingDate: 15,
                isActive: true,
            },
        }),
        prisma.fixedCost.create({
            data: {
                name: "Spotify",
                amount: 980,
                mainCategoryId: expenseCategories[6].id, // 雑費
                billingDate: 20,
                isActive: true,
            },
        }),
    ]);

    // 6. 予算の作成
    console.log("💰 Creating budgets...");
    await Promise.all([
        prisma.budget.create({
            data: {
                name: "沖縄旅行",
                totalAmount: 100000,
                startDate: new Date("2024-03-01"),
                endDate: new Date("2024-03-05"),
                description: "家族旅行の予算",
            },
        }),
        prisma.budget.create({
            data: {
                name: "PC環境構築",
                totalAmount: 150000,
                startDate: new Date("2024-02-01"),
                endDate: new Date("2024-02-28"),
                description: "在宅ワーク環境整備",
            },
        }),
        prisma.budget.create({
            data: {
                name: "今月の食費",
                totalAmount: 30000,
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-31"),
                description: "1月の食費予算",
            },
        }),
    ]);

    // 7. 投資データの作成
    console.log("📊 Creating investments...");
    await Promise.all([
        prisma.investment.create({
            data: {
                investmentName: "eMAXIS Slim S&P500",
                investmentCategoryId: investmentCategories[0].id, // NISA
                monthlyContribution: 33333,
                currentValue: 156789,
                date: new Date("2024-01-31"),
                profitLoss: 12345,
            },
        }),
        prisma.investment.create({
            data: {
                investmentName: "トヨタ自動車",
                investmentCategoryId: investmentCategories[1].id, // 個別株
                monthlyContribution: 0,
                currentValue: 45000,
                date: new Date("2024-01-31"),
                profitLoss: -5000,
            },
        }),
    ]);

    // 8. ポイントデータの作成
    console.log("🎁 Creating points...");
    await Promise.all([
        prisma.point.create({
            data: {
                name: "楽天ポイント",
                currentPoints: 5234,
                expiringPoints: 500,
                expirationDate: new Date("2024-02-28"),
                lastCheckedDate: new Date("2024-01-15"),
            },
        }),
        prisma.point.create({
            data: {
                name: "Tポイント",
                currentPoints: 1876,
                expiringPoints: 0,
                expirationDate: null,
                lastCheckedDate: new Date("2024-01-14"),
            },
        }),
        prisma.point.create({
            data: {
                name: "dポイント",
                currentPoints: 892,
                expiringPoints: 200,
                expirationDate: new Date("2024-01-31"),
                lastCheckedDate: new Date("2024-01-13"),
            },
        }),
    ]);

    // 9. サンプル取引データの作成
    console.log("💳 Creating sample transactions...");
    const budgets = await prisma.budget.findMany();

    await Promise.all([
        // 収入
        prisma.transaction.create({
            data: {
                amount: 250000,
                type: "income",
                mainCategoryId: incomeCategories[0].id, // 給与
                description: "12月分給与",
                date: new Date("2024-01-01"),
                paymentMethodId: paymentMethods[3].id, // 銀行振込
            },
        }),

        // 食費
        prisma.transaction.create({
            data: {
                amount: 500,
                type: "expense",
                mainCategoryId: expenseCategories[0].id, // 食費
                subCategoryId: subCategories[0].id, // ラーメン
                description: "一蘭ラーメン",
                date: new Date("2024-01-15"),
                budgetId: budgets[2].id, // 今月の食費
                paymentMethodId: paymentMethods[1].id, // 楽天カード
            },
        }),

        prisma.transaction.create({
            data: {
                amount: 2000,
                type: "expense",
                mainCategoryId: expenseCategories[0].id, // 食費
                subCategoryId: subCategories[1].id, // 自炊
                description: "スーパーで食材購入",
                date: new Date("2024-01-10"),
                budgetId: budgets[2].id, // 今月の食費
                paymentMethodId: paymentMethods[0].id, // 現金
            },
        }),

        // 自己投資
        prisma.transaction.create({
            data: {
                amount: 3000,
                type: "expense",
                mainCategoryId: expenseCategories[5].id, // 自己投資
                subCategoryId: subCategories[4].id, // 書籍
                description: "TypeScript本",
                date: new Date("2024-01-08"),
                paymentMethodId: paymentMethods[1].id, // 楽天カード
            },
        }),

        // 投資
        prisma.transaction.create({
            data: {
                amount: 33333,
                type: "expense",
                mainCategoryId: expenseCategories[7].id, // 投資
                description: "NISA積立",
                date: new Date("2024-01-01"),
                paymentMethodId: paymentMethods[3].id, // 銀行振込
            },
        }),

        // 交通費
        prisma.transaction.create({
            data: {
                amount: 200,
                type: "expense",
                mainCategoryId: expenseCategories[2].id, // 交通費
                subCategoryId: subCategories[8].id, // 電車
                description: "通勤電車代",
                date: new Date("2024-01-16"),
                paymentMethodId: paymentMethods[4].id, // Suica
            },
        }),
    ]);

    console.log("✅ Seeding completed successfully!");

    // 作成されたデータの確認
    const counts = await Promise.all([
        prisma.mainCategory.count(),
        prisma.subCategory.count(),
        prisma.paymentMethod.count(),
        prisma.budget.count(),
        prisma.fixedCost.count(),
        prisma.investment.count(),
        prisma.point.count(),
        prisma.transaction.count(),
    ]);

    console.log("📊 Created data summary:");
    console.log(`  - Main Categories: ${counts[0]}`);
    console.log(`  - Sub Categories: ${counts[1]}`);
    console.log(`  - Payment Methods: ${counts[2]}`);
    console.log(`  - Budgets: ${counts[3]}`);
    console.log(`  - Fixed Costs: ${counts[4]}`);
    console.log(`  - Investments: ${counts[5]}`);
    console.log(`  - Points: ${counts[6]}`);
    console.log(`  - Transactions: ${counts[7]}`);
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
