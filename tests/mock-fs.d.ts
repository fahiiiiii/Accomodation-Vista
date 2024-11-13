declare module 'mock-fs' {
    function mockFs(files?: any): void;
    function restore(): void;
    export = mockFs;
  }