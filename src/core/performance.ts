// const getPerformance = () => window.performance?window.performance:performance
const navTimes:PerformanceNavigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
const resourceTimes = performance.getEntriesByType('resource')

const TIMEOUT = 10000

export function getDomComplete(){
  return navTimes.domComplete;
}