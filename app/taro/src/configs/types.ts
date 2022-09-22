import { LogLevelDesc } from "loglevel";

export type SentryConfig = {
  dsn: string;
  environment: string;
};

export enum FeatureFlagsEnum {}

export type FeatureFlags = Record<FeatureFlagsEnum, boolean>;

export type FeatureFlagConfig = {
  remoteConfig?: {
    optimizely: string;
  };
  default: FeatureFlags;
};

export type AppsmithUIConfigs = {
  logLevel: LogLevelDesc;
};
