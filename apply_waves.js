const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const filesToUpdate = [
    'ProjectsClient.tsx',
    'LedgerClient.tsx',
    'MarketplaceClient.tsx',
    'GeneratorClient.tsx',
    'CollabClient.tsx',
    'CreditClient.tsx',
    'CalendarClient.tsx',
    'accounts/AccountsClient.tsx',
    'analytics/AnalyticsClient.tsx',
    'budgets/BudgetsClient.tsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(componentsDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Inject Import
    const dashboardWavesImport = file.includes('/') ? 'import { DashboardWaves } from "../DashboardWaves";\n' : 'import { DashboardWaves } from "./DashboardWaves";\n';

    if (!content.includes('import { DashboardWaves }')) {
        // Find Header import line
        const headerImportMatch = content.match(/import\s+{\s*Header\s*}\s+from\s+['"\.]+\/?Header['"];?/);
        if (headerImportMatch) {
            content = content.replace(headerImportMatch[0], `${headerImportMatch[0]}\n${dashboardWavesImport}`);
        } else {
            // Find Sidebar import line
            const sidebarImportMatch = content.match(/import\s+{\s*Sidebar\s*}\s+from\s+['"\.]+\/?Sidebar['"];?/);
            if (sidebarImportMatch) {
                content = content.replace(sidebarImportMatch[0], `${sidebarImportMatch[0]}\n${dashboardWavesImport}`);
            }
        }
    }

    // 2. Replace Outer Div exactly matching common patterns
    content = content.replace(
        /<div[^>]*className=["']([^"']*)bg-background([^"']*)["'][^>]*>\s*<Sidebar \/>/g,
        (match) => {
            return `<div className="flex bg-transparent h-screen overflow-hidden relative">\n            <DashboardWaves />\n            <Sidebar />`;
        }
    );

    // Some pages might not have exactly bg-background on the outer div, so let's do a broader replacement.
    // Replace:
    // <div className="flex h-screen overflow-hidden bg-background">
    //    <Sidebar />
    // OR
    // <div className="flex h-screen overflow-hidden">
    //    <Sidebar />

    // We can just locate the <Sidebar /> and the div wrapping it.
    // Instead of regex hacking the outer div perfectly, let's just make sure DashboardWaves is next to Sidebar
    // and the immediate next div gets z-10 for layering.

    if (!content.includes('<DashboardWaves />')) {
        content = content.replace(
            /(\s*)<Sidebar \/>(\s*<div[^>]*className=["']([^"']*)["'][^>]*>)/g,
            (match, p1, p2, classNames) => {
                let newClassNames = classNames;
                if (!newClassNames.includes('z-10')) {
                    newClassNames = newClassNames + ' z-10 relative';
                }
                const newP2 = p2.replace(classNames, newClassNames);
                return `${p1}<DashboardWaves />${p1}<Sidebar />${newP2}`;
            }
        );

        // Also ensure outer div is transparent.
        content = content.replace(/bg-background/g, 'bg-transparent relative');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
