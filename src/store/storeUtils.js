export const isAuthTokenExpired = tokenExpire => () => new Date() < new Date(tokenExpire)
