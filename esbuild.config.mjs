import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/index.js',
    format: 'cjs',
    // minify: true,
  })
  .catch(() => process.exit(1));
