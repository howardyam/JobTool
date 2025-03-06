// Initialize the context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "send-to-jobtool",
      title: "Send to JobTool",
      contexts: ["page", "selection", "link"]
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "send-to-jobtool") {
      // Send message to content script to scrape job data
      chrome.tabs.sendMessage(tab.id, { action: "scrapeJob" });
    }
  });
  
  // Handle messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "jobData") {
      // Send the job data to the native application
      chrome.runtime.sendNativeMessage(
        "com.jobtool.app",
        { jobData: message.data },
        (response) => {
          console.log("Response from native app:", response);
          // Notify content script of success/failure
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "jobProcessed",
            success: !!response,
            message: response ? "Job sent to JobTool successfully" : "Failed to send job to JobTool"
          });
        }
      );
      return true; // Required for async response
    }
  });