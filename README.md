# Politician Stock Trading Scrapper

This project is a web scraper designed to extract stock trading data of politicians. It uses Puppeteer for web scraping, OpenAI for PDF to JSON conversion, and Express for serving the data.

## Features

- Scrapes stock trading data of politicians from the web.
- Converts PDF data to JSON using OpenAI.
- Serves the data using an Express server.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/polititian-stock-trading-scrapper.git
```
2. Install NPM packages:
```sh
npm install
```
3. Create a `.env` file in the root directory and fill in your OpenAI API key, assistant ID, server port, and scrapper frequency:
```env
OPENAI_API_KEY = your_openai_api_key
OPENAI_ASSISTANT_ID = your_openai_assistant_id
PORT = your_port
SCRAPPER_FREQUENCY_MINUTES = your_scrapper_frequency
```
4. Start the server:
```sh
npm start
```

## Usage

Once the server is running, you can access the politician transaction data at `http://localhost:<your_port>/polititians-transaction-data-sse`.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Pending implementations

- [ ] Integrate TypeScript
- [ ] [Handle OpenAI Error Codes](https://help.openai.com/en/articles/6891839-api-error-codes)
- [ ] Database integration
- [ ] REST API
- [ ] Server deployment

## License

Distributed under the ISC License.

## Contact

Luis Hernández Martín - luisheratm@gmail.com

Project Link: [https://github.com/yourusername/polititian-stock-trading-scrapper](https://github.com/yourusername/polititian-stock-trading-scrapper)
