# 🚀 GetAIDiscounts.com | The Self-Growing AI Saver

This project automatically discovers trending AI tools, extracts verified discount codes, and prepares them for your web app.

## 🛠 How it Works
1. **Dynamic Discovery**: Every day, the script scouts for *new* AI categories (e.g., AI Music, AI Lawyers) so you don't have to update the list manually.
2. **AI-Powered Extraction**: It uses Tavily to find codes and GPT-4o-mini to verify and clean the data.
3. **Automated Deployment**: GitHub Actions runs the hunt at midnight and updates `ai_deals.json`.
4. **Zero-Effort Monetization**: The web app uses a `/go` redirector to automatically apply affiliate tracking to all links.

## 📦 File Structure
- `harvester.py`: The brain that discovers and hunts for codes.
- `requirements.txt`: Python libraries needed.
- `.github/workflows/harvest.yml`: The automation schedule.
- `README.md`: This guide.
- `ai_deals.json`: The data file (generated automatically).

## ⚙️ Setup Instructions (Must Follow Exactly)
1. **GitHub Repository**: Create a NEW repository and upload these 4 files/folders.
2. **API Keys**: 
   - Go to your GitHub Repo **Settings > Secrets and Variables > Actions**.
   - Add `TAVILY_API_KEY` (from [tavily.com](https://tavily.com)).
   - Add `OPENAI_API_KEY` (from [platform.openai.com](https://platform.openai.com)).
3. **Write Permissions (CRITICAL)**:
   - Go to **Settings > Actions > General**.
   - Scroll down to "Workflow permissions".
   - Select **Read and write permissions**. 
   - Check **"Allow GitHub Actions to create and approve pull requests"**.
   - Click **Save**. *If you miss this, the script cannot save the discount codes!*
4. **Initial Run**:
   - Go to the **Actions** tab in GitHub.
   - Select "Daily AI Code Harvest".
   - Click **Run workflow** -> **Run workflow**.

## 🤑 How You Get Paid
1. **Join a Network**: Sign up for **Skimlinks.com** or **Impact.com** (both are free).
2. **Global Script**: They will give you a "Global Tracking Script."
3. **Paste in Lovable**: Put that script on your `/go` page in Lovable. Every click through your site now earns you a commission automatically.

## 📈 SEO Strategy
The app is built to rank for "Long-Tail" keywords. By having separate pages for `/video`, `/voice`, etc., you will capture users searching for specific tools rather than just general discounts.
