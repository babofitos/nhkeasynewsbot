let nhkJSON = require('./nhkjson.js');
let getArticleId = require('./get_article_id.js');
let reddit = require('./reddit.js');
let findSubmittedArticles = require('./find_submitted_articles.js');
let checkDupe = require('./check_dupe.js');
let scrapeArticle = require('./scrape_article.js');
let formatSubmission = require('./format_submission.js');
let submitArticles = require('./submit_articles.js');
let config = require('../config.js');
let http = require('http');
//parse today's date into YYYY-MM-DD format
let date = require('./date.js');

let server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('A reddit bot for /r/NHKEasyNews');
});
server.listen(config.port);

require('./ping.js')(config.pingInterval);

async function main() {
  try {
    await reddit.login(config.username, config.password);
    setInterval(async function() {
      date.new(new Date());
      let nhkBody = await nhkJSON();
      let todaysArticleIds = getArticleId(nhkBody);
      let redditBody = await reddit.json();
      let submittedArticleIds = findSubmittedArticles(redditBody);
      let unsubmittedArticleIds = checkDupe(todaysArticleIds, submittedArticleIds);
      let articles = await Promise.all(scrapeArticle(unsubmittedArticleIds));
      articles = formatSubmission(articles);
      submitArticles(articles);
    }, config.loopInterval)
    
  }
   catch(err) {
    console.error(err);
    throw err;
  }

}

module.exports = main;