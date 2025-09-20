// Search utility functions for text highlighting and navigation

export interface SearchResult {
  element: HTMLElement;
  index: number;
  total: number;
}

// Check if a node should be included in the search
export const isSearchableNode = (node: Node): boolean => {
  // Skip script, style, and other non-text nodes
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(
      (node as Element).tagName
    )
  ) {
    return false;
  }
  return true;
};

// Configuration for search performance
const SEARCH_CONFIG = {
  MAX_MATCHES: 100, // Limit total matches to prevent memory issues
  BATCH_SIZE: 20,   // Process nodes in batches to prevent UI freeze
  DEBOUNCE_MS: 200  // Time between search batches
};

// Find all text nodes within an element that match the search term
export const findTextNodes = (
  element: Node,
  searchTerm: string,
  caseSensitive = false,
  onBatchComplete?: (matches: { node: Node; index: number }[]) => void
): Promise<{ node: Node; index: number }[]> => {
  return new Promise((resolve) => {
    const matches: { node: Node; index: number }[] = [];
    const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const textNodes: Node[] = [];
    
    // First pass: Collect text nodes
    const nodeCollector = document.createNodeIterator(
      element,
      NodeFilter.SHOW_TEXT,
      (node) => isSearchableNode(node) && node.textContent ? 
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    );
    
    let node;
    while ((node = nodeCollector.nextNode()) && matches.length < SEARCH_CONFIG.MAX_MATCHES) {
      if (node.textContent) {
        textNodes.push(node);
      }
    }
    
    // Process nodes in batches
    let currentIndex = 0;
    
    const processBatch = () => {
      const batchEnd = Math.min(
        currentIndex + SEARCH_CONFIG.BATCH_SIZE,
        textNodes.length
      );
      
      for (; currentIndex < batchEnd; currentIndex++) {
        const node = textNodes[currentIndex];
        if (!node.textContent) continue;
        
        const content = caseSensitive 
          ? node.textContent 
          : node.textContent.toLowerCase();
        
        let index = -1;
        while ((index = content.indexOf(search, index + 1)) !== -1 && 
               matches.length < SEARCH_CONFIG.MAX_MATCHES) {
          matches.push({ node, index });
        }
      }
      
      // Notify about batch completion
      if (onBatchComplete && matches.length > 0) {
        onBatchComplete(matches);
      }
      
      // Continue with next batch or resolve
      if (currentIndex < textNodes.length && matches.length < SEARCH_CONFIG.MAX_MATCHES) {
        setTimeout(processBatch, 0); // Yield to UI thread
      } else {
        resolve(matches);
      }
    };
    
    // Start processing
    processBatch();
  });
};

// Highlight text matches in the document
export const highlightMatches = async (
  searchTerm: string,
  caseSensitive = false,
  onProgress?: (progress: number) => void
): Promise<SearchResult[]> => {
  // Clear any existing highlights
  clearHighlights();

  if (!searchTerm.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  const searchLen = search.length;
  
  // Use a document fragment to batch DOM updates
  const fragment = document.createDocumentFragment();
  let matchCount = 0;
  
  // Process matches in batches
  const processMatches = async (matches: { node: Node; index: number }[]) => {
    for (const { node, index } of matches) {
      if (matchCount >= SEARCH_CONFIG.MAX_MATCHES) break;
      
      const content = node.textContent || '';
      const searchContent = caseSensitive ? content : content.toLowerCase();
      
      // Get the matching text
      const matchText = content.substring(index, index + searchLen);
      
      // Create highlight span for the match
      const highlightSpan = document.createElement('span');
      highlightSpan.className = 'highlight';
      highlightSpan.id = `highlight-${matchCount}`;
      highlightSpan.textContent = matchText;
      
      // Replace the matched text with our span
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + searchLen);
      range.deleteContents();
      range.insertNode(highlightSpan);
      
      // Add to results
      results.push({
        element: highlightSpan,
        index: matchCount,
        total: matchCount + 1
      });
      
      matchCount++;
      
      // Yield to UI thread every 10 matches
      if (matchCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
        if (onProgress) onProgress(matchCount);
      }
    }
  };
  
  // Find and process text nodes in batches
  await findTextNodes(
    document.body,
    searchTerm,
    caseSensitive,
    (batch) => processMatches(batch)
  );
  
  // Update total count for all results
  return results.map((result) => ({
    ...result,
    total: results.length
  }));
};

// Clear all highlighted text
export const clearHighlights = (): void => {
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (parent) {
      // Replace the highlight with just its text content
      parent.replaceChild(
        document.createTextNode(highlight.textContent || ''),
        highlight
      );
      // Normalize to merge adjacent text nodes
      parent.normalize();
    }
  });
};

// Scroll to a specific search result
export const scrollToMatch = (result: SearchResult | null): void => {
  if (!result) return;

  // Remove previous active highlight
  document.querySelectorAll('.highlight.active').forEach((el) => {
    el.classList.remove('active');
  });

  // Add active class to current highlight
  result.element.classList.add('active');

  // Scroll to the highlight
  result.element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });

  // Focus the highlight for keyboard navigation
  result.element.focus({ preventScroll: true });
};
