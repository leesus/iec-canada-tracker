export default {
  development: {
    db: process.env.MONGODB || 'YOUR_DATABASE',
    email: {
      provider: 'YOUR_EMAIL_PROVIDER',
      username: 'YOUR_EMAIL_USERNAME',
      password: 'YOUR_EMAIL_PASSWORD'
    },
    crawl_url: 'YOUR_TRACKED_WEBSITE',
    crawl_schedule: 'YOUR_DESIRED_SCHEDULE'
  },
  test: {
    db: process.env.MONGODB || 'YOUR_DATABASE',
    email: {
      provider: 'YOUR_EMAIL_PROVIDER',
      username: 'YOUR_EMAIL_USERNAME',
      password: 'YOUR_EMAIL_PASSWORD'
    },
    crawl_url: 'YOUR_TRACKED_WEBSITE',
    crawl_schedule: 'YOUR_DESIRED_SCHEDULE'
  },
  production: {
    db: process.env.MONGODB || 'YOUR_DATABASE',
    email: {
      provider: 'YOUR_EMAIL_PROVIDER',
      username: 'YOUR_EMAIL_USERNAME',
      password: 'YOUR_EMAIL_PASSWORD'
    },
    crawl_url: 'YOUR_TRACKED_WEBSITE',
    crawl_schedule: 'YOUR_DESIRED_SCHEDULE'
  }
};