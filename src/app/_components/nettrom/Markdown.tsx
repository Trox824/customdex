// markdown plugins
// import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
  onClick?: (event: React.MouseEvent) => void;
}

const Markdown = ({ content, onClick }: MarkdownProps) => {
  const processedContent = content.replace(
    /\[(Xem thêm|Thu gọn)\]/g,
    '<span class="cursor-pointer text-blue-500 hover:underline" data-action="toggle">[$1]</span>',
  );

  return (
    <div
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: processedContent,
      }}
    />
  );
};

export default Markdown;
