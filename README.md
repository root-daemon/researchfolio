# ResearchFolio

A modern, minimalist portfolio template built with Astro and Lenis. Showcase your professional experience, skills, and projects with a clean and responsive design.

## Features

- 🚀 Built with Astro for optimal performance
- 🖱️ Lenis for smooth scrolling
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🌙 Dark/Light theme support
- 🔧 Easy to customize and hot swappable.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or bun

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/researchfolio.git
cd researchfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to see the result.

## Customization

### Personal Information

Edit `data.json` in the root directory to update your personal information:

```json
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "biography": "Your bio",
  "resume": "Link to your resume",
  "github": "Your GitHub profile URL",
  "location": "Your Location",
  "linkedin": "Your LinkedIn profile URL",
  "experience": [...],
  "skills": {...},
  "achievements": [...],
}
```

### Experience

Add your work experience in the `experience` array in `data.json`:

```json
{
  "companyName": "Company Name",
  "companyURL": "Company Website URL",
  "companyLogo": "Company Logo URL",
  "title": "Your Position",
  "location": "Job Location",
  "employmentType": "Full-time/Part-time/Internship",
  "start": {
    "year": 2024,
    "month": 1
  },
  "end": {
    "year": 2024,
    "month": 12
  }
}
```

### Skills

Update your skills in the `skills` object in `data.json`:

```json
{
  "frontend": ["HTML & CSS", "JavaScript", "React"],
  "backend": ["Node.js", "Express"],
  "database": ["MongoDB", "PostgreSQL"],
  "others": ["Git", "Docker"]
}
```

## Deployment

### Vercel (Recommended)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Vercel will automatically detect Astro and configure the build settings
4. Deploy!

### Manual Deployment

1. Build the project:
```bash
npm run build
# or
yarn build
# or
bun run build
```

2. The build output will be in the `dist` directory

3. Deploy the `dist` directory to your hosting provider

## License

This project is open source and available under the MIT License.

## Support

If you find any bugs or have feature requests, please open an issue on GitHub.