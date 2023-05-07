
declare global {
    declare type RootState = import('../src/app/appStore').RootState
    declare type AppDispatch = import('../src/app/appStore').AppDispatch
    declare type AppStore = import('../src/app/appStore').AppStore
  }

export {}