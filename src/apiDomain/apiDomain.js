const isProd = import.meta.env.PROD;

export const apiDomain = isProd
    ? 'https://todofarmwithirene.com/api' // Placeholder for production
    : 'http://localhost:3001/api';
