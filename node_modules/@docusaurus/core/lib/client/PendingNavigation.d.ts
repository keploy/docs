/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import React from 'react';
import { type RouteComponentProps } from 'react-router-dom';
import type { RouteConfig } from 'react-router-config';
import type { Location } from 'history';
import './nprogress.css';
interface Props extends RouteComponentProps {
    readonly routes: RouteConfig[];
    readonly delay: number;
    readonly location: Location;
}
interface State {
    nextRouteHasLoaded: boolean;
}
declare class PendingNavigation extends React.Component<Props, State> {
    previousLocation: Location | null;
    progressBarTimeout: NodeJS.Timeout | null;
    constructor(props: Props);
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
    private clearProgressBarTimeout;
    private startProgressBar;
    private stopProgressBar;
    render(): JSX.Element;
}
declare const _default: React.ComponentClass<Pick<Props, "routes" | "delay">, any> & import("react-router").WithRouterStatics<typeof PendingNavigation>;
export default _default;
