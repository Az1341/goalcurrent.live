export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("gc-theme");if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
