import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line react/prop-types
export default function MarkdownFileRenderer({ filePath }){
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((err) => console.error('Error loading markdown file:', err));
  }, [filePath]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
};