// src/global.d.ts
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
// src/global.d.ts
declare module '@ckeditor/ckeditor5-build-classic';
