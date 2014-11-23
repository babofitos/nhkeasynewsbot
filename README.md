Script to scrape nhk web easy articles and then post them to reddit  

Made for /r/NHKEasyNews  

Usage  
```
node index.js reddit_username reddit_password YYYY-MM-DD
```

YYYY-MM-DD is the date of the articles you want to be scraped.  

Make sure you create a config.json and fill in the appropriate information.  
The script checks for duplicates by looking for the article id in selftext in the last 25 posts.  
The account you use must have enough link karma to not need to fill out a captcha on submission.  
