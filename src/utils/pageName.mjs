// Function to extract page name from URL for file naming
export function getPageName(url) {
  const arraySegment = url.split("/")
    let lastPart = arraySegment.pop();
    if (lastPart === "") {
      lastPart = arraySegment.pop();
    }
    return lastPart.replace(/[^a-zA-Z0-9]/g, "_");
  }
  