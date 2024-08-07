This is a mobile prayer app built in React Native. 

The idea was to take an old website and essentially web scrape its content to be rendered on an app for easier navigation than visiting the app on mobile allows. 

You'll find several examples of how I split up the routing based on the type of article that is clicked as well as how I set up the homepage using flat lists for easier navigation. 

There is a web-scraping component to this app that essentially takes every possible variation of the HTML that exists on the original site and formats it better for mobile. This modified HTML is then stored locally and is re-rendered using a react native library to render native web views. 

This app was ultimately abandoned because I realized there was a far better way to do this project than my current setup and so I am in the process of transitioning to this new idea. 
