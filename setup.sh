#!/bin/bash

# Minimal Todo App - Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 Minimal Todo App - Setup Script"
echo "===================================="
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Node.js version is 18+
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure .env.local before continuing!"
    echo ""
    echo "Required steps:"
    echo "1. Run: npx convex dev"
    echo "2. Copy CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL from the output"
    echo "3. Generate BETTER_AUTH_SECRET with: openssl rand -base64 32"
    echo "4. Paste these values into .env.local"
    echo ""
    echo "Then run this script again with --skip-env flag"
    exit 0
fi

echo "✅ .env.local found"
echo ""

# Check if Convex is configured
if ! grep -q "CONVEX_DEPLOYMENT=dev:" .env.local; then
    echo "⚠️  .env.local appears incomplete. Please configure it first."
    echo "   See QUICKSTART.md for instructions."
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Start Convex dev server
echo "🔄 Starting Convex development server..."
echo "   (This will run in the background)"
echo ""

# Check if Convex is already running
if lsof -Pi :8187 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "ℹ️  Convex dev server is already running"
else
    echo "Starting convex dev..."
    npx convex dev &
    CONVEX_PID=$!
    echo "✅ Convex dev server started (PID: $CONVEX_PID)"

    # Wait for Convex to be ready
    echo "⏳ Waiting for Convex to be ready..."
    sleep 5
fi

echo ""

# Install Convex components
echo "📦 Installing Convex components..."
echo ""

if [ -d "convex/_generated" ]; then
    echo "Installing Better Auth component..."
    npx convex components install @convex-dev/better-auth --save || echo "Already installed"

    echo "Installing Rate Limiter component..."
    npx convex components install @convex-dev/rate-limiter --save || echo "Already installed"

    echo "Installing Agent component..."
    npx convex components install @convex-dev/agent --save || echo "Already installed"

    echo "✅ Convex components installed"
else
    echo "⚠️  Convex _generated directory not found."
    echo "   Make sure 'npx convex dev' has run successfully."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  pnpm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
