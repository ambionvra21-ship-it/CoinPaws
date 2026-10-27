export const initializeAdMob = async (): Promise<void> => {
  console.log("AdMob framework fallback initialised in sandbox browser view environment.");
  return Promise.resolve();
};

export const showRewardVideoAd = async (): Promise<boolean> => {
  console.log("Triggered simulation advertisement video playback overlay view.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};
