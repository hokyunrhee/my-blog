import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM && process.env.NODE_ENV === 'development') {
    import('react-grab').catch(() => {});
  }
}
