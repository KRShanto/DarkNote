import fetcher from "@/lib/fetcher";
import { NotebookType } from "@/types/data/notebook";
import React, { useState, useEffect } from "react";
import moment from "moment";
import Link from "next/link";

import { FaClock } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export default function DisplayBooks() {
  const [books, setBooks] = useState<NotebookType[]>([]);

  async function getBooks() {
    const json = await fetcher("/api/get-books", {});

    if (json.type !== "SUCCESS") {
      throw new Error(json.msg);
    }

    setBooks(json.data);
  }

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <div className="display">
        {books.map((book) => {
          return (
            <Link href={`/book/${book._id}`} className="card" key={book._id}>
              <div className="main">
                <h2 className="title">{book.title}</h2>
                <p className="description">{book.description}</p>
              </div>
              <div className="info">
                <p className="createdAt">
                  <FaClock />
                  {moment(book.createdAt).fromNow()}
                </p>
                {book.locked && (
                  <FaLock className="locked" title="This book is locked" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
