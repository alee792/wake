export type ReplayMediaMapping = {
  replayStartSeconds: number;
  replayEndSeconds: number;
  assetId: string;
  mediaStartSeconds: number;
  mediaEndSeconds?: number;
  src?: string;
  poster?: string;
};

export type PackagedReplayMediaAsset = {
  assetId: string;
  src: string;
  poster?: string;
  label: string;
  alt: string;
};

export type ResolvedReplayMedia = PackagedReplayMediaAsset & {
  desiredTimeSeconds: number;
  replayStartSeconds: number;
  replayEndSeconds: number;
};

export function resolveReplayMedia(
  currentReplaySeconds: number,
  mappings: ReplayMediaMapping[],
  assets: PackagedReplayMediaAsset[],
): ResolvedReplayMedia | undefined {
  const mapping = mappings.find(
    (candidate) =>
      currentReplaySeconds >= candidate.replayStartSeconds &&
      currentReplaySeconds <= candidate.replayEndSeconds,
  );
  if (!mapping) return undefined;

  const asset =
    assets.find(
      (candidate) =>
        mapping.src !== undefined && candidate.src === mapping.src,
    ) ?? assets.find((candidate) => candidate.assetId === mapping.assetId);
  if (!asset) return undefined;

  const unclamped =
    mapping.mediaStartSeconds +
    currentReplaySeconds -
    mapping.replayStartSeconds;
  const desiredTimeSeconds =
    mapping.mediaEndSeconds === undefined
      ? Math.max(mapping.mediaStartSeconds, unclamped)
      : Math.min(
          mapping.mediaEndSeconds,
          Math.max(mapping.mediaStartSeconds, unclamped),
        );

  return {
    ...asset,
    desiredTimeSeconds,
    replayStartSeconds: mapping.replayStartSeconds,
    replayEndSeconds: mapping.replayEndSeconds,
  };
}
