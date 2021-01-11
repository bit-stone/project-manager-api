export const config = {
  port: process.env.PORT || 4000,
  mongoURI: "mongodb://localhost:27017/bs-project-manager",
  jwt: {
    duration: 3600,
    secret: "GU$R6YzmLxMWTbKhSbKq"
  }
};
