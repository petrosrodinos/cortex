import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { getFilePreviewUrl } from '@/lib/message-markdown.utils';

const markdownClassName =
  'max-w-none min-w-0 text-sm leading-relaxed [&_a]:text-accent [&_a]:underline [&_code]:break-words [&_code]:rounded [&_code]:bg-surface-secondary [&_code]:px-1 [&_code]:py-0.5 [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_pre]:my-3 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-secondary [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5';

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href ? getFilePreviewUrl(href) : href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }) => (
    <div className="my-3 w-full max-w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-max border-collapse text-left text-xs" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-surface-secondary" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border-b border-border px-3 py-2 font-medium text-foreground whitespace-nowrap" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-border px-3 py-2 align-top whitespace-normal text-foreground" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr className="last:[&>td]:border-b-0" {...props}>
      {children}
    </tr>
  ),
};

interface MessageMarkdownProps {
  content: string;
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => (
  <div className={markdownClassName}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  </div>
);
