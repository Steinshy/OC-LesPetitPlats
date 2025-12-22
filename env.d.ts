interface ImportMetaEnv {
  readonly BASE_URL?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    readonly dispose: (callback: () => void) => void;
  };
}


