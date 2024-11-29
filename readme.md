# Live BTC Price Dashboard

This project is a simple web application that demonstrates the use of the API to fetch and display real-time Bitcoin (BTC) price data in EUR. It includes a live price update feature, a graph showing BTC price movement over the last week, and a percentage indicator reflecting weekly performance.

## Features

- **Live Price Updates**: The BTC price updates every 2 seconds, ensuring users see the most current value.
- **Weekly Trend Graph**: A line chart shows the price trend of BTC over the last 7 days.
- **Percentage Change Indicator**: A dynamic label displays the percentage change in BTC price compared to its value a week ago.
- **Modern Design**: A clean, responsive design using the `Bricolage Grotesque` font for aesthetics.

## Purpose

This project serves as a test to experiment with integrating third-party APIs (such as CoinDesk) to fetch real-time cryptocurrency data. It provides a foundational example of how to:
- Work with asynchronous JavaScript (`async/await`) for fetching data.
- Dynamically update content on a web page using DOM manipulation.
- Visualize data using the Chart.js library.

## How It Works

1. The app fetches the current BTC price in EUR using the CoinDesk API.
2. It fetches the historical price data for the last 7 days to populate the graph.
3. The percentage change is calculated by comparing the latest price to the price from 7 days ago.
4. All data is updated periodically, with the live price refreshing every 2 seconds and percentage/graph updates occurring every 5 seconds.

## Technologies Used

- **HTML**: For the structure of the page.
- **CSS**: For styling, including a grid background and responsive design.
- **JavaScript**: For dynamic data fetching and DOM updates.
- **Chart.js**: To render the weekly price trend graph.
- **CoinDesk API**: To retrieve Bitcoin price data.

## Notes

- This is a test project meant to showcase the integration of APIs and dynamic updates on a web page.

## License

This project is provided as-is for educational purposes. Feel free to modify and use it in your own projects.
