import { Provider } from 'jotai';

export const withJotai = <P extends object>(Component: React.ComponentType<P>) => {
  return function WithJotaiWrapper(props: P) {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };
};
