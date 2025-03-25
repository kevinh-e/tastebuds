"use client"

import { useState, useEffect } from "react"

export default function TagInput({ onTagsChange, placeholder = "Add a tag...", initialTags = [] }) {
  const [inputValue, setInputValue] = useState("")
  const [tags, setTags] = useState(initialTags)

  // Update tags if initialTags changes from parent
  useEffect(() => {
    setTags(initialTags)
  }, [initialTags])

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault()
      addTag(inputValue.trim())
    } else if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag) => {
    // Don't add duplicate tags
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      onTagsChange(newTags)
      setInputValue("")
    } else {
      setInputValue("")
    }
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
    onTagsChange(newTags)
  }

  return (
    <div className="border rounded-md p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className={`flex flex-wrap gap-2 ${tags.length > 0 && 'mb-2'}`}>
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-secondary-foreground hover:text-destructive focus:outline-none hover:cursor-pointer"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="w-full focus:outline-none bg-transparent"
      />
    </div>
  )
}

