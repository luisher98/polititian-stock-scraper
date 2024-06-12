export const url = "https://disclosures-clerk.house.gov/FinancialDisclosure";
export const year = "2024";
export const selectors = {
    searchSidebarButton: '[data-view="ViewSearch"]',
    dropdownSelector: "#FilingYear",
    searchButtonSelector: 'button[aria-label="search button"][title="Search"]',
    dataTableSelector: "#DataTables_Table_0_wrapper",
    
    urlDataTableSelector: "#DataTables_Table_0 tbody tr a",

    infoDataTableSelector: "#DataTables_Table_0 tbody tr",
    nameDataTableSelector: 'td[data-label="Name"]',
    officeDataTableSelector: 'td[data-label="Office"]',
};