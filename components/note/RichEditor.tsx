import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

function RichEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  function handleEditorChange(content: any, editor: any) {
    setContent(content);
  }

  return (
    <Editor
      id="tiny-mce"
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={content}
      onEditorChange={handleEditorChange}
      toolbar="undo redo | styles | bold italic | alignleft aligncenter alignright | link image | bullist numlist outdent indent"
      plugins="code link image lists"
      init={{
        height: 500,
        menubar: false,
        skin: "oxide-dark",
        content_css: "dark",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:25px; }",
        placeholder: "Write your note here ...",
      }}
    />
  );
}

export default RichEditor;
