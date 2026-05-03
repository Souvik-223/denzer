/* eslint-disable @typescript-eslint/no-explicit-any */

export type TreeItem = string | [string, ...TreeItem[]];

export interface ErrorFallbackProps {
	error: any;
	resetErrorBoundary: (...args: any[]) => void;
}
