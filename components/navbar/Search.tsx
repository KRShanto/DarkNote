import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

interface SearchNote {
  id: string;
  title: string;
  textContent: string[];
}

export default function Search() {
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<SearchNote[]>([]);
  const [shouldShowSearchResults, setShouldShowSearchResults] = useState(false);

  const { books } = useBooksWithNotesStore();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  // Find notes that matches the search
  // Only filter book.notes
  // 1. Filter by title - Show the title and first few words of content
  // 2. Filter by content - Show the title and the matched sentence and its upper and bottom part
  useEffect(() => {
    // Filter by title
    const filterNotesByTitle: SearchNote[] = [];
    // Filter by content
    const filterNotesByContent: SearchNote[] = [];

    // If search is empty, don't show anything
    if (search === "") {
      setFilteredNotes([]);
      return;
    }

    books.forEach((book) => {
      book.notes.forEach((note) => {
        if (note.title.toLowerCase().includes(search.toLowerCase())) {
          const title = generateMatchHtml(note.title);

          filterNotesByTitle.push({
            id: note._id,
            title,
            textContent: [note.textContent.slice(0, 50)],
          });
        }

        if (note.textContent.toLowerCase().includes(search.toLowerCase())) {
          // Split the content into sentences
          const contentArr = note.textContent.split("\n");

          // remove empty sentences
          const contentArrWithoutEmptySentences = contentArr.filter(
            (sentence) => sentence !== ""
          );

          // The index of the matched sentence
          const indexOfMatchedSentence =
            contentArrWithoutEmptySentences.findIndex((sentence) =>
              sentence.toLowerCase().includes(search.toLowerCase())
            );

          // The upper index of the matched sentence
          const start = indexOfMatchedSentence - 1;
          // The bottom index of the matched sentence
          const end = indexOfMatchedSentence + 1;

          // If start is less than 0, then set it to 0
          const startIndex = start < 0 ? 0 : start;
          // If end is greater than the length of the content array, then set it to the last index
          const endIndex =
            end >= contentArrWithoutEmptySentences.length
              ? contentArrWithoutEmptySentences.length - 1
              : end;

          // Starting sentence
          const startSentenceContent =
            contentArrWithoutEmptySentences[startIndex];
          // Matched sentence
          const matchedSentenceContent =
            contentArrWithoutEmptySentences[indexOfMatchedSentence];
          // Ending sentence
          const endSentenceContent = contentArrWithoutEmptySentences[endIndex];

          // check if start content and end content is the same as matched content
          // if it is, then don't show start and end content
          let fullSentence = [];

          // Both start and end are the same as matched
          // It means that the matched sentence is the only sentence in the note
          if (
            startSentenceContent === matchedSentenceContent &&
            endSentenceContent === matchedSentenceContent
          ) {
            fullSentence = [matchedSentenceContent];
          }
          // Start and matched are the same
          // It means that the matched sentence is the first sentence in the note
          else if (startSentenceContent === matchedSentenceContent) {
            fullSentence = [matchedSentenceContent, endSentenceContent];
          }
          // End and matched are the same
          // It means that the matched sentence is the last sentence in the note
          else if (endSentenceContent === matchedSentenceContent) {
            fullSentence = [startSentenceContent, matchedSentenceContent];
          }
          // Start, end and matched are not the same
          // It means that the matched sentence is in the middle of the note
          else {
            fullSentence = [
              startSentenceContent,
              matchedSentenceContent,
              endSentenceContent,
            ];
          }

          // Generate html for each sentence
          // Wrap the matched text with <span> tag
          const matchedContent = fullSentence.map((sentence) =>
            generateMatchHtml(sentence)
          );

          filterNotesByContent.push({
            id: note._id,
            title: note.title,
            textContent: matchedContent,
          });
        }
      });
    });

    // Merge the two arrays
    setFilteredNotes([...filterNotesByTitle, ...filterNotesByContent]);
  }, [search, books]);

  // when page is changes, search input should be cleared
  useEffect(() => {
    setSearch("");
  }, [router]);

  // handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // keyboard shortcut: ctrl + k -> focus on search input
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setShouldShowSearchResults(true);
      }

      // keyboard shortcut: esc -> blur search input
      if (e.key === "Escape") {
        searchRef.current?.blur();
        setShouldShowSearchResults(false);
      }
    };

    // register event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // remove event listener
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // when typing in search input, show search results
  useEffect(() => {
    setShouldShowSearchResults(true);
  }, [filteredNotes]);

  // Generate html for matched text
  // Wrap the matched text with <span> tag
  function generateMatchHtml(matchedText: string) {
    return matchedText.replace(
      new RegExp(search, "gi"),
      (match) => `<span class="matched">${match}</span>`
    );
  }

  function clearSearch() {
    setSearch("");
    setFilteredNotes([]);
  }

  return (
    <div className="search-section">
      <div className="search">
        <div className="input">
          <input
            id="search-input"
            type="text"
            placeholder="Search you notes"
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaTimes className="icon" onClick={clearSearch} />
        </div>
        <label className="search-btn" htmlFor="search-input">
          <FaSearch />
        </label>
      </div>

      {filteredNotes.length > 0 && shouldShowSearchResults && (
        <div className="search-results">
          {filteredNotes.map((note, index) => (
            <Link href={`/note/${note.id}`} key={index} className="result">
              <h3 dangerouslySetInnerHTML={{ __html: note.title }} />
              {note.textContent.map((sentence, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: sentence }} />
              ))}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
