import * as fs from 'fs';
import * as path from 'path';

describe('globals.css design system', () => {
  let css: string;

  beforeAll(() => {
    css = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8');
  });

  it('includes Tailwind directives', () => {
    expect(css).toMatch(/@tailwind base/);
    expect(css).toMatch(/@tailwind components/);
    expect(css).toMatch(/@tailwind utilities/);
  });

  it('body should have overflow-x: hidden', () => {
    expect(css).toMatch(/overflow-x:\s*hidden/);
  });

  it('should define btn-primary component', () => {
    expect(css).toMatch(/\.btn-primary/);
  });

  it('should define container-site component', () => {
    expect(css).toMatch(/\.container-site/);
  });

  it('should define form-input component', () => {
    expect(css).toMatch(/\.form-input/);
  });

  it('should define material-symbols-outlined styles', () => {
    expect(css).toMatch(/\.material-symbols-outlined/);
  });
});
