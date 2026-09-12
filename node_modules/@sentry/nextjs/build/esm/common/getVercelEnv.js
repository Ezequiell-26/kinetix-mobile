function getVercelEnv(isClient) {
  const vercelEnvVar = isClient ? process.env.NEXT_PUBLIC_VERCEL_ENV : process.env.VERCEL_ENV;
  return vercelEnvVar ? `vercel-${vercelEnvVar}` : void 0;
}

export { getVercelEnv };
//# sourceMappingURL=getVercelEnv.js.map
