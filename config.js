module.exports = {
  username: process.argv[2] || process.env.USER,
  password: process.argv[3] || process.env.PW,
  subreddit: process.env.SUBREDDIT || 'nhkeasynewsscripttest',
  separator: "\n\n&nbsp;\n\n",
  delay: 2000,
  loopInterval: "900000",
  pingInterval: "300000",
  port: process.env.PORT || 5000,
  url: process.env.URL || 'http://localhost:5000',
  // env: process.env.NODE_ENV || 'development'
  env: 'development'
};