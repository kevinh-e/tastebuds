"use client"

import { useState, useEffect, useRef } from "react"
import { X, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function TagInput({
  onTagsChange,
  placeholder = "Add a tag...",
  initialTags = [],
  className,
  suggestions = [],
}) {
  const [inputValue, setInputValue] = useState("")
  const [tags, setTags] = useState(initialTags)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)

  // Update tags if initialTags changes from parent
  useEffect(() => {
    setTags(initialTags)
  }, [initialTags])

  // Filter suggestions to match from the start of the word
  let filteredSuggestions = suggestions
    .filter((s) => s.toLowerCase().startsWith(inputValue.trim().toLowerCase()) && !tags.includes(s))
    .slice(0, 8);

  // If input is not empty, not already a tag, and not in suggestions, add as first suggestion
  const inputTrimmed = inputValue.trim();
  if (
    inputTrimmed &&
    !tags.includes(inputTrimmed) &&
    !suggestions.some((s) => s.toLowerCase() === inputTrimmed.toLowerCase())
  ) {
    filteredSuggestions = [
      { value: inputTrimmed, isCustom: true },
      ...filteredSuggestions.map((s) => ({ value: s, isCustom: false })),
    ];
  } else {
    filteredSuggestions = filteredSuggestions.map((s) => ({ value: s, isCustom: false }));
  }

  // Always highlight the first suggestion when input changes or suggestions open
  useEffect(() => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, showSuggestions]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
    setShowSuggestions(true)
    // setHighlightedIndex(0) will be handled by useEffect
  }

  const handleInputKeyDown = (event) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        return;
      } else if (event.key === "Enter") {
        event.preventDefault();
        // Always add the highlighted suggestion (default to first)
        const indexToAdd = highlightedIndex >= 0 ? highlightedIndex : 0;
        addTag(filteredSuggestions[indexToAdd].value);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        return;
      }
    }

    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault()
      addTag(inputValue.trim())
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    } else if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (event.key === "Escape") {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      onTagsChange(newTags)
      setInputValue("")
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    } else {
      setInputValue("")
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
    onTagsChange(newTags)
  }

  const handleInputBlur = (e) => {
    setTimeout(() => setShowSuggestions(false), 150)
    if (inputValue.trim() !== "") {
      addTag(inputValue.trim())
    }
  }

  // Fix: always pass suggestion.value to handleSuggestionClick
  const handleSuggestionClick = (suggestionObj) => {
    addTag(typeof suggestionObj === 'string' ? suggestionObj : suggestionObj.value);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="min-h-[2.5rem] w-full rounded-md border border-input bg-white px-3 py-2 text-sm transition-colors focus-within:border-gray-400">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="group h-6 pl-2 pr-1 text-xs font-medium transition-colors hover:bg-secondary/80"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove tag</span>
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            autoComplete="off"
          />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredSuggestions.map((suggestionObj, index) => (
              <div
                key={suggestionObj.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  index === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseDown={() => handleSuggestionClick(suggestionObj.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                {suggestionObj.isCustom ? (
                  <span className="font-bold">Add "{suggestionObj.value}"</span>
                ) : (
                  suggestionObj.value
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
