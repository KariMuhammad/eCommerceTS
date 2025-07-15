const root = process.cwd();

export default {
  env: process.env.NODE_ENV,

  serverDomain: process.env.SERVER_DOMAIN,
  serverPort: process.env.SERVER_PORT,
  server: `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`,
  root: root,
  static: "./static/public",

  cors: {
    origin: process.env.CORS_ORIGIN,
  },

  db_uri: process.env.DB_ATLAS_URI,
  db_name: process.env.DB_NAME,

  secret_key: process.env.SECRET_KEY,
  refresh_key: process.env.REFRESH_TOKEN_KEY,

  mail_account: process.env.MAIL_ACCOUNT,
  mail_password: process.env.MAIL_PASSWORD_APP,

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    resource_link: process.env.CLOUDINARY_RESOURCE_LINK,
  },
};
