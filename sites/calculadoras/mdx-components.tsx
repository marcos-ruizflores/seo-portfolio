import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Las tablas pueden ser más anchas que el móvil: scroll solo dentro de la tabla.
    table: (props) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    ...components,
  };
}
