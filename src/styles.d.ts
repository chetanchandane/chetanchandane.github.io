// Side-effect imports of plain stylesheets (e.g. import "./Foo.scss").
// CRA's react-scripts types only declare CSS Modules (*.module.scss),
// so plain *.scss / *.sass / *.css imports need their own declarations.
declare module "*.scss";
declare module "*.sass";
declare module "*.css";
