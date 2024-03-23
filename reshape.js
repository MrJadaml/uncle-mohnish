
const fs = require('fs');

// Read the JSON file
fs.readFile('13f-trade-history-2009-2023 copy.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse JSON data
    let jsonData = JSON.parse(data);

    // Iterate over each year
    for (const year in jsonData) {
      // Iterate over each quarter within the year
      jsonData[year].forEach(quarter => {
        // Lowercase "Quarter" to "quarter"
        quarter.quarter = quarter.Quarter;
        delete quarter.Quarter;

        // Lowercase "Activities" to "activities"
        quarter.activities = quarter.Activities;
        delete quarter.Activities;

        // Iterate over each activity within the quarter
        quarter.activities.forEach(activity => {
          // Lowercase "Activity" to "transactionType"
          activity.transactionType = activity.Activity;
          delete activity.Activity;

          // Split "Company" into "companyName" and "stockTicker"
          const [ticker, companyName] = activity.Company.split(' - ');
          activity.companyName = companyName;
          activity.stockTicker = ticker;
          delete activity.Company;

          // Convert "Shares" to lowercase, remove commas, and convert to integer
          if (activity.Shares) {
            activity.shares = parseInt(activity.Shares.replace(/,/g, ''), 10);
            delete activity.Shares;
          }

          // Convert "ShareChangePercentage" to float and camel case the field name
          if (activity.ShareChangePercentage) {
            activity.shareChangePercentage = parseFloat(activity.ShareChangePercentage);
            delete activity.ShareChangePercentage;
          }

          // Convert "PortfolioChangePercentage" to float and camel case the field name
          if (activity.PortfolioChangePercentage) {
            activity.portfolioChangePercentage = parseFloat(activity.PortfolioChangePercentage);
            delete activity.PortfolioChangePercentage;
          }
        });
      });
    }

    // Convert back to JSON string
    const modifiedJson = JSON.stringify(jsonData, null, 2);

    // Write the modified JSON back to the file
    fs.writeFile('modified_data.json', modifiedJson, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON file has been modified successfully!');
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
