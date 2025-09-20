import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { highlightMatches, clearHighlights, SearchResult } from '@/utils/searchUtils';

// Debounce function with cancel capability and promise support
interface DebouncedFunction<T extends (...args: any[]) => Promise<any>> {
  (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined>;
  cancel: () => void;
}

const debounce = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): DebouncedFunction<T> => {
  let timeout: NodeJS.Timeout | null = null;
  let latestResolve: ((value: Awaited<ReturnType<T>> | undefined) => void) | null = null;
  
  const debounced = (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
        if (latestResolve) {
          latestResolve(undefined); // Resolve previous promise with undefined
        }
      }
      
      latestResolve = resolve;
      
      timeout = setTimeout(async () => {
        timeout = null;
        try {
          const result = await func(...args);
          if (latestResolve) {
            latestResolve(result);
          }
        } catch (error) {
          if (latestResolve) {
            latestResolve(undefined);
          }
        } finally {
          latestResolve = null;
        }
      }, wait);
    });
  };
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (latestResolve) {
      latestResolve(undefined);
      latestResolve = null;
    }
  };
  
  return debounced;
};

interface SearchBarProps {
  onNoResults?: () => void;
  className?: string;
}

export default function SearchBar({ onNoResults, className = '' }: SearchBarProps) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatch, setCurrentMatch] = useState<number>(-1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  
  // Refs
  const searchResults = useRef<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearching = useRef(false);
  const searchAbortController = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoized handlers
  const clearSearch = useCallback(() => {
    // Cancel any ongoing search
    if (isSearching.current && searchAbortController.current) {
      searchAbortController.current.abort();
      searchAbortController.current = null;
      isSearching.current = false;
    }
    
    setSearchTerm('');
    clearHighlights();
    setCurrentMatch(-1);
    setTotalMatches(0);
    setSearchProgress(0);
    searchResults.current = [];
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSearch = useCallback(async (term: string): Promise<SearchResult[]> => {
    if (term.trim() === '') {
      clearSearch();
      return [];
    }

    try {
      setSearchProgress(0);
      const results = await highlightMatches(
        term,
        false,
        (progress) => setSearchProgress(Math.min(progress, 100))
      );
      
      if (searchAbortController.current?.signal.aborted) return [];
      return results;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error);
      }
      return [];
    }
  }, [clearSearch]);
  
  // Debounced search function
  const debouncedSearch = useRef<DebouncedFunction<typeof handleSearch>>(
    debounce(handleSearch, 300)
  ).current;

  const scrollToMatch = useCallback(async (index: number) => {
    if (searchResults.current.length === 0) return Promise.resolve();
    
    // Wrap around if needed
    const newIndex = (index + searchResults.current.length) % searchResults.current.length;
    const result = searchResults.current[newIndex];
    
    if (!result) return Promise.resolve();
    
    setCurrentMatch(newIndex);
    
    // Return a promise that resolves when scrolling is complete
    return new Promise<void>((resolve) => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        const element = document.getElementById(`search-match-${result.id}`);
        if (!element) {
          resolve();
          return;
        }
        
        // Scroll to the element
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        // Add active class to highlight the current match
        const currentActive = document.querySelector('.search-match-active');
        if (currentActive) {
          currentActive.classList.remove('search-match-active');
        }
        element.classList.add('search-match-active');
        
        // Resolve after a short delay to ensure scroll is complete
        setTimeout(resolve, 300);
      });
    });
  }, []);

  const navigateMatches = useCallback((direction: 'next' | 'prev') => {
    if (searchResults.current.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (currentMatch + 1) % searchResults.current.length
      : (currentMatch - 1 + searchResults.current.length) % searchResults.current.length;
    
    scrollToMatch(newIndex);
  }, [currentMatch, scrollToMatch, searchResults]);

  // Handle search term changes with debouncing
  useEffect(() => {
    let isMounted = true;
    
    const search = async () => {
      // Skip if already searching or unmounted
      if (isSearching.current || !isMounted) return;
      
      // Clear highlights immediately when search is cleared
      if (searchTerm.trim() === '') {
        clearHighlights();
        setCurrentMatch(-1);
        setTotalMatches(0);
        setSearchProgress(0);
        searchResults.current = [];
        return;
      }
      
      isSearching.current = true;
      const controller = new AbortController();
      searchAbortController.current = controller;
      
      try {
        const results = await debouncedSearch(searchTerm);
        
        // Skip if aborted or unmounted
        if (controller.signal.aborted || !isMounted) return;
        
        searchResults.current = results || [];
        setTotalMatches(searchResults.current.length);
        
        if (searchResults.current.length > 0) {
          setCurrentMatch(0);
          await scrollToMatch(0);
        } else if (onNoResults) {
          onNoResults();
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError' && isMounted) {
          console.error('Search error:', error);
        }
      } finally {
        if (isMounted) {
          isSearching.current = false;
        }
      }
    };
    
    search();
    
    // Cleanup on unmount or when search term changes
    return () => {
      isMounted = false;
      if (searchAbortController.current) {
        searchAbortController.current.abort();
        searchAbortController.current = null;
      }
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, onNoResults, scrollToMatch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if search is active and not in an input/textarea
      const target = e.target as HTMLElement;
      if (searchTerm.trim() === '' || 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable) {
        return;
      }

      if (e.key === 'Enter' && e.shiftKey) {
        // Shift+Enter: go to previous match
        e.preventDefault();
        navigateMatches('prev');
      } else if (e.key === 'Enter') {
        // Enter: go to next match
        e.preventDefault();
        navigateMatches('next');
      } else if (e.key === 'Escape') {
        // Escape: clear search
        e.preventDefault();
        clearSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, navigateMatches]);



  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term === '') return;
    
    // Force a search if we don't have results yet
    if (searchResults.current.length === 0) {
      isSearching.current = true;
      searchAbortController.current = new AbortController();
      
      try {
        const results = await handleSearch(term);
        
        if (searchAbortController.current?.signal.aborted) return;
        
        searchResults.current = results;
        setTotalMatches(results.length);
        
        if (results.length > 0) {
          setCurrentMatch(0);
          await scrollToMatch(0);
        } else if (onNoResults) {
          onNoResults();
        }
      } finally {
        isSearching.current = false;
      }
    } else {
      // If we have matches, navigate to the next one
      navigateMatches('next');
    }
  }, [searchTerm, searchResults, onNoResults, navigateMatches, scrollToMatch, handleSearch]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search this page..."
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              aria-label="Search this page"
            />
            {searchProgress > 0 && searchProgress < 100 && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-blue-200">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
            )}
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {searchTerm && totalMatches > 0 && (
        <div className="absolute right-0 mt-1 flex items-center text-sm text-gray-500 bg-white border rounded-md px-3 py-1 shadow-lg z-10">
          <button
            onClick={() => navigateMatches('prev')}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Previous match"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <span className="mx-2">
            {currentMatch + 1} of {totalMatches}
          </span>
          <button
            onClick={() => navigateMatches('next')}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Next match"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Add styles for highlights */}
      <style>
        {
          `
            .highlight {
              background-color: rgba(255, 255, 0, 0.4);
              padding: 0 1px;
              border-radius: 2px;
              position: relative;
            }
            .highlight.active {
              background-color: rgba(255, 215, 0, 0.6);
              outline: 2px solid #f59e0b;
              outline-offset: 1px;
            }
          `
        }
      </style>
    </div>
  );
}
