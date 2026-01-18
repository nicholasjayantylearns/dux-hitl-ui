#!/bin/bash
# Test script for BDD Dashboard extraction

echo "🧪 Testing BDD Dashboard Extraction..."
echo "=====================================\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from extraction-bdd-dashboard directory."
    exit 1
fi

echo "✅ Directory structure check passed"

# Check key files exist
FILES_TO_CHECK=(
    "bdd-progress/page.tsx"
    "bdd/progress/route.ts" 
    "bdd/features/route.ts"
    "jtbd_timeline.tsx"
    "timeout-manager.js"
    "README.md"
)

echo "\n📁 Checking extracted files..."
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Found"
    else
        echo "❌ $file - Missing"
    fi
done

echo "\n📦 Installing dependencies..."
npm install --quiet

echo "\n🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed"
    exit 1
fi

echo "\n🎉 BDD Dashboard extraction test completed!"
echo "Run 'npm run dev' to start the development server"
echo "Then visit: http://localhost:3000/bdd-progress"