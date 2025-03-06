// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scrapeJob") {
      // Scrape job data based on current site
      const jobData = scrapeJobData();
      
      // Send job data back to background script
      chrome.runtime.sendMessage({
        type: "jobData",
        data: jobData
      });
    } else if (message.action === "jobProcessed") {
      // Show notification to user
      showNotification(message.success, message.message);
    }
  });
  
  // Function to scrape job data from different job sites
  function scrapeJobData() {
    const url = window.location.href;
    let jobData = {
      title: "Unknown Title",
      company: "Unknown Company",
      location: "Unknown Location",
      description: "No description available",
      requirements: [],
      url: url,
      date_scraped: new Date().toISOString()
    };
  
    // LinkedIn scraping logic
    if (url.includes("linkedin.com")) {
      const title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.textContent.trim();
      const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.textContent.trim();
      const location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.textContent.trim();
      const description = document.querySelector(".jobs-description__content")?.textContent.trim();
      
      if (title) jobData.title = title;
      if (company) jobData.company = company;
      if (location) jobData.location = location;
      if (description) jobData.description = description;
      
      // Extract requirements
      const requirementsList = document.querySelectorAll(".job-details-jobs-unified-top-card__job-insight");
      requirementsList.forEach(item => {
        jobData.requirements.push(item.textContent.trim());
      });
    }
    
    // JobStreet scraping logic
    else if (url.includes("jobstreet.com")) {
      const title = document.querySelector("[data-automation='detailsTitle']")?.textContent.trim();
      const company = document.querySelector("[data-automation='detailsCompany']")?.textContent.trim();
      const location = document.querySelector("[data-automation='detailsLocation']")?.textContent.trim();
      const description = document.querySelector("[data-automation='jobDescription']")?.textContent.trim();
      
      if (title) jobData.title = title;
      if (company) jobData.company = company;
      if (location) jobData.location = location;
      if (description) jobData.description = description;
      
      // Extract requirements
      const requirementsList = document.querySelectorAll("[data-automation='jobRequirements'] li");
      requirementsList.forEach(item => {
        jobData.requirements.push(item.textContent.trim());
      });
    }
    
    // Fallback generic scraping for other job sites
    else {
      // Try to find job title - common selectors
      const titleSelectors = ['h1', '.job-title', '.position-title', '[itemprop="title"]'];
      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          jobData.title = element.textContent.trim();
          break;
        }
      }
      
      // Try to find company name - common selectors
      const companySelectors = ['.company-name', '.employer', '[itemprop="hiringOrganization"]'];
      for (const selector of companySelectors) {
        const element = document.querySelector(selector);
        if (element) {
          jobData.company = element.textContent.trim();
          break;
        }
      }
      
      // Try to find job description - common selectors
      const descriptionSelectors = ['.job-description', '#job-description', '[itemprop="description"]'];
      for (const selector of descriptionSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          jobData.description = element.textContent.trim();
          break;
        }
      }
    }
  
    return jobData;
  }
  
  // Function to show notification to user
  function showNotification(success, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${success ? '#4CAF50' : '#F44336'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }