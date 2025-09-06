declare module 'react-quill' {
  import * as React from 'react';

  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    modules?: any;
    formats?: string[];
    className?: string;
  }

  const ReactQuill: React.ComponentClass<ReactQuillProps>;
  export default ReactQuill;
}
