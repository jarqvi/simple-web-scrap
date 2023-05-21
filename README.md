# Simple Web Scraping Project
This is a simple web scraping project written in Node.js that utilizes MongoDB as the database and Puppeteer package to scrape data from the website https://rahavard365.com/. The project scrapes the website daily at 12 o'clock, saves the scraped data in the database, and generates a CSV file as the final output.
## Installation
To get started with this project, you will need to follow these steps:

1.  Clone the project repository to your local machine using the following command:

    bashCopy code
    
    ```
    $ git clone https://github.com/jarqvi/simple-web-scrap.git
    ```

2.  Change into the project directory:

    bashCopy code
    
    ```
    $ cd simple-web-scrap
    ```

3.  Install the required packages using npm:

    Copy code
    
    ```
    $ npm install
    ```
    ## Usage
    ### To run the web scraping project, follow these steps:
    1.    Start the MongoDB server.
    2.    Open a terminal or command prompt and navigate to the project directory.
    3.    Run the following command to start the scraping process:
    
    Copy code
    
    ```
    $ npm start
    ```
    ## Dependencies
    The project relies on the following dependencies:

      - Node.js
      - Puppeteer: A Node.js library for controlling a headless Chrome or Chromium browser.
      - MongoDB: A document-oriented database used for storing the scraped data.
    ### Make sure you have these dependencies installed before running the project.
    
