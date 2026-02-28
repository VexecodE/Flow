
const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'components');
const filesToUpdate = [
    'ScannerClient.tsx', 'ProjectsClient.tsx', 'LedgerClient.tsx', 'MarketplaceClient.tsx',
    'GeneratorClient.tsx', 'CollabClient.tsx', 'CreditClient.tsx', 'CalendarClient.tsx',
    'accounts/AccountsClient.tsx', 'analytics/AnalyticsClient.tsx', 'budgets/BudgetsClient.tsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(componentsDir, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (!content.includes('DashboardWaves')) {
        const importStatement = file.includes('/') ? 'import { DashboardWaves } from "../DashboardWaves";\n' : 'import { DashboardWaves } from "./DashboardWaves";\n';

        // 1. Add import safely
        content = content.replace(/(import\s*{\s*Sidebar\s*}\s*from\s*['"][^'"]*['"];?\s*\n)/, `$1${importStatement}`);

        // 2. Add <DashboardWaves />
        content = content.replace(/(<Sidebar \/>)/, `<DashboardWaves />\n            <Sidebar />`);

        // 3. Make outer div transparent
        content = content.replace(/bg-background/, 'bg-transparent relative');

        // 4. Add z-10 relative to the flex container under Sidebar
        // Find: <Sidebar />\n            <div className="flex-1
        content = content.replace(/(<Sidebar \/>[\s\S]*?<div\s+className=['"])([^'"]*)(['"])/, function (match, p1, p2, p3) {
            if (!p2.includes('relative')) p2 += ' relative';
            if (!p2.includes('z-10')) p2 += ' z-10';
            return p1 + p2 + p3;
        });

        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
