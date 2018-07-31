declare module 'freactal' {
  export function hydrate(bootstrapState: any): any

  interface InjectedProps {
    effects: IEffects
    state: any
  }

  export function injectState<Props>(
    comp: React.ComponentType<Props>,
    keys?: string[]
  ): React.ComponentType<Props>

  export function softUpdate(arg: (state: any, ...args: any[]) => object): any

  export function hardUpdate(arg: any): any

  interface IEffects {
    [key: string]: Promise<any>
  }

  type EffectArgument<State> = (state: State) => State

  interface IEffectsArgs<State> {
    [key: string]: (
      effects: IEffects,
      ...args: any[]
    ) => EffectArgument<State> | Promise<EffectArgument<State>>
  }

  interface ProvideStateOptions<State> {
    initialState?: () => State
    effects?: IEffectsArgs<State>
    computed?: {
      [key: string]: (arg: State) => any
    }
    middleware?: (ctx: ProvideStateOptions<State>) => ProvideStateOptions<State>
  }

  export function provideState<T, OldProps>(
    opts: ProvideStateOptions<T>
  ): (comp: React.ComponentType<OldProps>) => React.ComponentType<OldProps>
}
