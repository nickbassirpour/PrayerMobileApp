<h3>This is a mobile prayer app built in Expo, a framework for React Native. </h3>

The idea was to take an old website and essentially web scrape its content to be rendered on an app for easier navigation than visiting the website on mobile. 

<h3>Routing with Expo</h3>

You'll find several examples of how I split up the routing based on the type of article that is clicked as well as how I set up the homepage using flat lists for easier navigation. 
Here is an example of how routing is done in Expo: <b>/app/(tabs)/home/[category]/[url]/index.tsx</b>
In this example, all folders in the (tabs) folder appear at the bottom of the app as clickable tabs. Inside the home folder, there are several dynamic routes similar to how routing was made popular by Next.JS where depending on the article they clicked, it will set the category and url routes based on the article's path. This way, I know what to display on top of the page. If the article is in the 'Saint of the Day' category, I would then put those words at the top. The URL is simply there as a unique identifier for consistent navigation. 

<h3>Web Scraping with Cheerio.JS</h3>

There is a web-scraping component that you can find here: <b>/webScraper/scrapeArticles.tsx</b> 
This essentially takes every possible variation of the HTML that exists on the original site and formats it better for mobile. This modified HTML is then stored locally in the <b>/data/articles/SOD</b> folder automatically. The articles are re-rendered using a react native library to render native web views. 

<h3>Downloading images using fs and path</h3>

All of the images of the articles are downloaded and stored locally in the <b>/assets</b> folder as the scraping is in progress. The first image file path is stored in the article object in the <b>/lists</b> folder in order to render the image on the link from the homepage or list of articles page. The other images' file paths are added directly into the HTML of the articles as they are stored locally and will be rendered when the view is clicked. 

<h3>The SRP</h3>

In the webscraper file, I did my best to adhere to the Single-Responsibility Principle by making sure that each function had one job. I originally built this with maybe 3 functions that had many sub-functions inside of it and later re-factored the entire file so that it appeared much cleaner on the page and so that each function could be easily modified and examined for errors.

<h3>Gone but not forgotten...</h3>

This app was ultimately abandoned because I realized there was a far better way to do this project than my current setup and so I am in the process of transitioning to this new idea. I will be moving away from storing all of this locally and will instead be storing these articles in a database for easier management. The images will no longer be downloaded manually but I will simply reference them from their current location on the actual web. I will also not be scraping the entire HTML as it is but will be scraping the article in paragraph nodes to be re-rendered more properly for a mobile view. No apps today use text-wrapping to wrap text around images. Paragraphs should be read in their entirety and if there is an image they should not share space with text width-wise in order to not crowd up the screen and appear small. I learned an incredible amount from this project and plan on taking these skills to my next mobile app. 

<h3>The future!</h3>

I still want to complete this app one day but I plan on building it far more efficiently from a backend perspective. I plan on using ASP.NET Core API for the controller and SQL Server for the model. I am still unsure about the view but I will likely go with Expo again. I may try my hand at .NET MAUI Blazor Hybrid just to really test my C# skills.

<b>Thank you for reading.</b>
