import {AuthTiming} from "../../constants";

function testTokenDuration(expiration: number, testDuration: number) {
  const now = new Date().getTime() / 1000;
  const timeLeft = expiration - now;
  console.log(timeLeft);
  return timeLeft < testDuration;
}

export const tokenNeedsRefresh = (expiration: number) => testTokenDuration(expiration, AuthTiming.TOKEN_REFRESH)
export const tokenIsExpired = (expiration: number) => testTokenDuration(expiration, AuthTiming.TOKEN_EXPIRED)
