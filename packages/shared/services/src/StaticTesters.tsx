import {AuthTiming} from "../../constants";

function testTokenDuration(expiration: number, testDuration: number) {
  const now = new Date().getTime();
  const lastSeen = now - expiration;
  console.log(lastSeen / 1000, testDuration);
  return lastSeen / 1000 > testDuration;
}

export const tokenNeedsRefresh = (expiration: number) => testTokenDuration(expiration, AuthTiming.TOKEN_REFRESH)
export const tokenIsExpired = (expiration: number) => testTokenDuration(expiration, AuthTiming.TOKEN_EXPIRED)
