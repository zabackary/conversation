import { Box, Link, Paper, SxProps, useTheme } from "@mui/material";
import { HTMLAttributes, PropsWithChildren, SyntheticEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";
import darkSyntaxHighlightingTheme from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark";
import lightSyntaxHighlightingTheme from "react-syntax-highlighter/dist/esm/styles/prism/material-light";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import onlyText from "../onlyText";
import AsyncSyntaxHighlighter from "./AsyncSyntaxHighlighter";

function MaterialMarkdownBlockquote({ children }: PropsWithChildren) {
  return (
    <Paper
      component="blockquote"
      elevation={3}
      sx={{
        borderLeft: "3px solid black",
        borderLeftColor: "primary.main",
        pl: 1,
        py: 0.5,
        ml: 0,
      }}
    >
      {children}
    </Paper>
  );
}

function MaterialMarkdownP({ children }: PropsWithChildren) {
  return (
    <Box component="p" sx={{ my: 0 }}>
      {children}
    </Box>
  );
}

function MaterialMarkdownOl({ children }: PropsWithChildren) {
  return (
    <Box component="ol" sx={{ paddingInlineStart: 3 }}>
      {children}
    </Box>
  );
}

function MaterialMarkdownUl({ children }: PropsWithChildren) {
  return (
    <Box
      component="ul"
      sx={{
        paddingInlineStart: 3,
        "& li": {
          paddingInlineStart: 1,
          "&::marker": {
            content:
              "url(https://m3.material.io/static/assets/list-bullet-dark.svg)",
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

function MaterialMarkdownAnchor({
  children,
  href,
}: PropsWithChildren<{ href?: string }>) {
  const preventBubble = (e: SyntheticEvent) => {
    e.stopPropagation();
  };
  return (
    <Box component="span" onMouseDown={preventBubble} onClick={preventBubble}>
      <Link href={href} target="_blank">
        {children}
      </Link>
    </Box>
  );
}

function MaterialMarkdownCode({ children }: PropsWithChildren) {
  return (
    <Paper
      sx={{
        padding: "2px",
      }}
      elevation={1}
      component="code"
    >
      {children}
    </Paper>
  );
}

function MaterialMarkdownHighlighterPre({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLPreElement>>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Paper component="pre" {...props} elevation={3}>
      {children}
    </Paper>
  );
}

function MaterialMarkdownPre({
  children,
  node,
}: PropsWithChildren<{ node: unknown }>) {
  let language: string | null;
  if (
    typeof node === "object" &&
    node &&
    "children" in node &&
    Array.isArray(node.children)
  ) {
    const child = node.children[0] as unknown;
    if (
      child &&
      typeof child === "object" &&
      "properties" in child &&
      typeof child.properties === "object" &&
      child.properties &&
      "className" in child.properties &&
      Array.isArray(child.properties.className)
    ) {
      const className = child.properties.className[0] as unknown;
      if (typeof className === "string") {
        language = className.slice(9);
      } else {
        language = null;
      }
    } else {
      language = null;
    }
  } else {
    language = null;
  }
  const theme = useTheme();
  return (
    <AsyncSyntaxHighlighter
      language={language ?? "text"}
      PreTag={MaterialMarkdownHighlighterPre}
      style={
        theme.palette.mode === "dark"
          ? darkSyntaxHighlightingTheme
          : lightSyntaxHighlightingTheme
      }
    >
      {onlyText(children)}
    </AsyncSyntaxHighlighter>
  );
}

export interface MaterialReactMarkdownProps extends ReactMarkdownOptions {
  inline?: boolean;
  sx?: SxProps;
}

export default function MaterialReactMarkdown({
  inline,
  sx,
  ...reactMarkdownProps
}: MaterialReactMarkdownProps) {
  const plugins: PluggableList = [remarkGfm].concat(
    inline ? [remarkBreaks] : []
  );
  return (
    <Box sx={sx}>
      <ReactMarkdown
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...reactMarkdownProps}
        components={{
          blockquote: MaterialMarkdownBlockquote,
          p: MaterialMarkdownP,
          ol: MaterialMarkdownOl,
          ul: MaterialMarkdownUl,
          a: MaterialMarkdownAnchor,
          code: MaterialMarkdownCode,
          pre: MaterialMarkdownPre,
        }}
        remarkPlugins={plugins}
      />
    </Box>
  );
}
