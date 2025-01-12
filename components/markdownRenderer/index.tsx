import { MDXComponents } from 'mdx/types';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import Image from 'next/image';

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;
type ParagraphProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;
type ListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;
type ListItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;
type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
type BlockquoteProps = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;
type CodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & { className?: string };
type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

// Custom components for MDX
const components: MDXComponents = {
  h1: (props: HeadingProps) => (
    <h1 className="text-3xl font-bold my-4" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-2xl font-bold my-3" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-xl font-bold my-2" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="text-lg font-bold my-2" {...props} />
  ),
  p: (props: ParagraphProps) => <p className="my-2" {...props} />,
  ul: (props: ListProps) => (
    <ul className="list-disc list-inside my-2" {...props} />
  ),
  ol: (
    props: React.DetailedHTMLProps<
      React.OlHTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >,
  ) => <ol className="list-decimal pl-4 my-2" {...props} />,
  li: (props: ListItemProps) => <li className="my-1" {...props} />,
  a: (props: AnchorProps) => (
    <a className="text-blue-500 hover:underline" {...props} />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-2"
      {...props}
    />
  ),
  code: ({ className, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <code className={`${className} block p-2 rounded`} {...props} />
    ) : (
      <code className="bg-gray-700 rounded px-1" {...props} />
    );
  },
  pre: (props: PreProps) => (
    <pre
      className="bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto"
      {...props}
    />
  ),
  // Image component with different handling based on source
  img: ({ src, alt, ...props }: any) => {
    console.log('Image has been triggered', src, props);

    // Handle relative paths (local images)
    if (
      src?.startsWith('./') ||
      src?.startsWith('../') ||
      src?.startsWith('/')
    ) {
      return (
        <div className="my-4 relative w-full h-[400px]">
          <Image
            src={src}
            alt={alt || 'Image'}
            className="object-contain"
            layout="responsive"

            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    }

    // Handle external images
    if (src?.startsWith('http')) {
      return (
        <div className="my-4">
          <Image
            src={src}
            alt={alt || 'Image'}
            layout="responsive"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...props}
          />
        </div>
      );
    }

    // Handle base64 or data URLs
    if (src?.startsWith('data:')) {
      return (
        <div className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || 'Image'}
            className="max-w-full h-auto rounded-lg shadow-md"
            {...props}
          />
        </div>
      );
    }

    // Fallback for other cases
    return (
      <div className="my-4 flex items-center justify-center bg-gray-100 rounded-lg p-4">
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  },
};

const MarkdownRenderer = (props: MDXRemoteProps) => {
  return (
    <div className="prose max-w-none">
      <MDXRemote {...props} components={components} />
    </div>
  );
};

export default MarkdownRenderer;
