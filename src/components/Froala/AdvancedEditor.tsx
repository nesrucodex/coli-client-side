// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// ! Custom Styles
import "./froala-basic.css";

import FroalaEditorComponent from "react-froala-wysiwyg";

// Import all Froala Editor plugins;
// import 'froala-editor/js/plugins.pkgd.min.js';

// Import a single Froala Editor plugin.
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/lists.min.js";

// Import a language file.
// import 'froala-editor/js/languages/de.js';

// Import a third-party plugin.
// import 'froala-editor/js/third_party/image_tui.min.js';
// import 'froala-editor/js/third_party/embedly.min.js';
// import "froala-editor/js/third_party/spell_checker.min.js";

// Include font-awesome css if required.
// install using "npm install font-awesome --save"
import "font-awesome/css/font-awesome.css";
import "froala-editor/js/third_party/font_awesome.min.js";

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

// Render Froala Editor component.

type IAdvancedEditor = {
  hMin?: number;
  hMax?: number;
  wMax?: string;
  placeholder?: string;
  initial: string;
  onTextareaChangeHandler: (content: string) => void;
  hideEditor?: boolean;
};
const AdvancedEditor = ({
  initial,
  onTextareaChangeHandler,
  hMin = 60,
  hMax = 120,
  placeholder = "Type what is in your head...",
  hideEditor = false,
  wMax = "auto",
}: IAdvancedEditor) => {
  const config = {
    placeholderText: placeholder,
    charCounterCount: true,
    heightMin: hMin,
    heightMax: hMax,
    textWrap: true,
  };

  const writingElement = document.querySelector(
    ".fr-element"
  ) as HTMLDivElement;
  const writingBox = document.querySelector(".fr-element") as HTMLDivElement;
  if (wMax !== "auto" && writingBox) writingBox.style.maxWidth = wMax;
  if (hideEditor && writingElement) writingElement.style.display = "none";
  else if (writingElement) writingElement.style.display = "block";

  return (
    <section>
      <FroalaEditorComponent
        tag="textarea"
        config={config}
        model={initial.trim() === "" ? undefined : initial}
        onModelChange={(content: string) => onTextareaChangeHandler(content)}
      />
    </section>
  );
};

export default AdvancedEditor;
