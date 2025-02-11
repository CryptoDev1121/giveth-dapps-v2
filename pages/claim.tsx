import Head from 'next/head';
import { useEffect } from 'react';

import ClaimView from '@/components/views/claim/Claim.view';
import { ClaimProvider } from '@/context/claim.context';
import { ETheme, useGeneral } from '@/context/general.context';

export default function GIVdropRoute() {
	const { setShowHeader, setTheme } = useGeneral();

	useEffect(() => {
		setShowHeader(false);
		setTheme(ETheme.Dark);
		return () => {
			setShowHeader(true);
			setTheme(ETheme.Light);
		};
	}, [setShowHeader, setTheme]);

	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<ClaimProvider>
				<ClaimView />
			</ClaimProvider>
		</>
	);
}
