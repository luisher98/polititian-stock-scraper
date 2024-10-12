# Politician Stock Trading Scraper

This project is a web scraper designed to extract stock trading data of politicians. It uses Puppeteer for web scraping, OpenAI for PDF to JSON conversion, and Express for serving the data.

## Features

- Scrapes stock trading data of politicians from the web.
- Converts PDF data to JSON using OpenAI.
- Serves the data using an Express server.

## Getting Started

### Prerequisites

- Node.js
- npm
- Suficient OpenAI credits
- MongoDB 

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

MONGODB_USER = your_mongo_user
MONGODB_PASSWORD = your_mongo_password
MONGODB_DATABASE_URI = your_mongo_uri
MONGODB_DB = your_mongo_db_name
MONGODB_COLLECTION = your_mongo_db_collection
```
4. Start the server:
```sh
npm run start
```

### Creating an assistant and getting its ID

1. Go to [https://platform.openai.com/assistants](https://platform.openai.com/assistants)

2. Click on the top right corner to create a new assistant

<p align="center">
<img src="https://github.com/luisher98/polititian-stock-scrapper/assets/29884531/2bd4a5d3-cb70-4773-8334-8ac66d3b17f2" width="600" style="text-align:center;">
</p>

3. Make sure the options File Search and Code Interpreter are selected, and that the temperature is set to low
   
<p align="center">
<img src="https://github.com/luisher98/polititian-stock-scrapper/assets/29884531/f310c91c-c915-4083-946c-e1b135918a5f" width="450" style="text-align:center;">
</p>

4. The add the assistant ID to OPENAI_ASSISTANT_ID 

## Usage

Once the server is running, you can subscribe to the politician transaction data events at `http://localhost:<your_port>/polititians-transaction-data-sse`.
RESTful API is on its way too.

## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Architecture
![image](https://github.com/luisher98/polititian-stock-scrapper/assets/29884531/b236c532-d817-4c62-84e6-6efde9c11813)


## Pending implementations

- [ ] Integrate TypeScript (we need to improve data validation)
- [ ] Creation of a committee API [link](https://github.com/luisher98/US-Polititian-Committee-API)
- [ ] [Handle OpenAI Error Codes](https://help.openai.com/en/articles/6891839-api-error-codes)
- [ ] Database integration
- [ ] REST API
- [ ] Server deployment

## License

Distributed under the ISC License.

## Contact

Luis Hernández Martín - luisheratm@gmail.com

Project Link: [https://github.com/luisher98/polititian-stock-trading-scrapper](https://github.com/luisher98/polititian-stock-trading-scrapper)
