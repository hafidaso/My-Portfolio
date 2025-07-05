# GitHub Integration Setup Guide

This guide will help you set up your GitHub data to display in your portfolio.

## 🚀 Quick Setup

### 1. Update Your GitHub Username

Edit `src/config/github.ts` and change the username:

```typescript
USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'YOUR_GITHUB_USERNAME',
```

### 2. Set Environment Variables (Optional but Recommended)

Create a `.env.local` file in your project root:

```bash
# Your GitHub username
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username

# GitHub Personal Access Token (optional, for higher rate limits)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
```

### 3. Get a GitHub Token (Optional)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio Integration"
4. Select scopes: `public_repo` (for public repos) or `repo` (for private repos)
5. Copy the token and add it to your `.env.local` file

## 📊 What Will Be Displayed

### GitHub Stats Component
- Total repositories
- Total stars received
- Followers count
- Following count
- Most used programming languages (pie chart)

### Featured Projects Component
- Top 4 repositories by stars and recent activity
- Repository descriptions
- Star and fork counts
- Technology tags
- Links to GitHub and live demos

### Projects Page
- All your repositories
- Filtering by technology
- Sorting by stars, forks, update date, or name
- Search functionality
- Separate tabs for owned vs contributed projects

## 🔧 Customization

### Change Featured Projects Count
Edit `src/config/github.ts`:

```typescript
FEATURED_PROJECTS_COUNT: 6, // Change from 4 to any number
```

### Change Repositories Per Page
Edit `src/config/github.ts`:

```typescript
REPOS_PER_PAGE: 50, // Change from 100 to any number
```

### Update Cache Duration
Edit `src/config/github.ts`:

```typescript
CACHE_DURATION: 10 * 60 * 1000, // Change from 5 minutes to 10 minutes
```

## 🎯 Best Practices

1. **Add Topics to Your Repositories**: Add relevant topics to your GitHub repositories to improve technology detection
2. **Write Good Descriptions**: Add clear descriptions to your repositories for better display
3. **Pin Important Repositories**: Pin your best projects on GitHub for better visibility
4. **Use Consistent Naming**: Use consistent naming conventions for your repositories

## 🐛 Troubleshooting

### No Data Showing
- Check that your GitHub username is correct
- Ensure your repositories are public (unless using a token with private access)
- Check browser console for any API errors

### Rate Limit Issues
- Add a GitHub token to increase rate limits
- Check that your token has the correct permissions

### Caching Issues
- Clear browser cache
- Check that the cache duration is appropriate for your needs

## 📝 Example Configuration

```typescript
// src/config/github.ts
export const GITHUB_CONFIG = {
  USERNAME: 'your_github_username',
  TOKEN: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  REPOS_PER_PAGE: 100,
  FEATURED_PROJECTS_COUNT: 6,
  CACHE_DURATION: 5 * 60 * 1000,
};
```

## 🚀 Deploy

After setting up your configuration:

1. Test locally: `npm run dev`
2. Build: `npm run build`
3. Deploy to Netlify or your preferred platform

Your GitHub data will now be displayed in your portfolio! 