import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents } from '@capacitor-community/admob';

// Official Test Rewarded Ad Unit ID (Replace with your actual AdMob Rewarded Unit ID in production)
const REWARDED_AD_UNIT_ID = 'ca-app-pub-6655685917040449~5170056805';

export interface RevenueSplit {
  grossAdRevenuePhp: number;
  userPayoutPhp: number;       // 5% share to user
  developerProfitPhp: number;   // 95% share to app owner
}

/**
 * Calculates payout according to 95% App Profit / 5% User Distribution model.
 * Estimated eCPM baseline: 1 Rewarded Ad impression =  4.00 gross revenue ($0.07 USD approx)
 */
export function calculateAdRevenueSplit(grossRevenuePhp: number = 4.00): RevenueSplit {
  const userSharePercent = 0.05; // 5% user distribution
  const devSharePercent = 0.95;  // 95% app profit

  const userPayoutPhp = Number((grossRevenuePhp * userSharePercent).toFixed(2)); //  0.20 per ad
  const developerProfitPhp = Number((grossRevenuePhp * devSharePercent).toFixed(2)); //  3.80 per ad

  return {
    grossAdRevenuePhp: grossRevenuePhp,
    userPayoutPhp,
    developerProfitPhp,
  };
}

export async function initializeAdMob(): Promise<void> {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [],
      initializeForTesting: true,
    });
  } catch (err) {
    console.warn('AdMob native engine not active (running in web mode):', err);
  }
}

export async function showRewardedAd(onRewardClaimed: (rewardAmountPhp: number) => void): Promise<boolean> {
  try {
    const options: RewardAdOptions = {
      adId: REWARDED_AD_UNIT_ID,
    };

    await AdMob.prepareRewardVideoAd(options);
    
    AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
      const split = calculateAdRevenueSplit(4.00);
      onRewardClaimed(split.userPayoutPhp);
    });

    await AdMob.showRewardVideoAd();
    return true;
  } catch (err) {
    console.warn('AdMob show error, falling back to simulated bounty:', err);
    const split = calculateAdRevenueSplit(4.00);
    onRewardClaimed(split.userPayoutPhp);
    return false;
  }
}
