import React, { useState, useEffect } from 'react';
import { Flex } from '../styled-components/Flex';
import {
	IconExternalLink,
	IconGIVBack,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import {
	GIVbacksTopContainer,
	GIVbacksBottomContainer,
	GIVbackRewardCard,
	Left,
	Right,
	GBSubtitle,
	GBTitle,
	GbDataBlock,
	GbButton,
	GIVBackCard,
	RoundSection,
	RoundTitle,
	RoundInfo,
	RoundInfoRow,
	RoundInfoTallRow,
	RoundButton,
	InfoSection,
	InfoImage,
	InfoTitle,
	InfoDesc,
	GivAllocated,
	InfoReadMore,
} from './GIVbacks.sc';
import { useTokenDistro } from '@/context/tokenDistro.context';
import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { HarvestAllModal } from '../modals/HarvestAll';
import { getNowUnixMS } from '@/helpers/time';
import { useSubgraph } from '@/context';
import { formatDate } from '@/lib/helpers';
import { GIVBackExplainModal } from '../modals/GIVBackExplain';
import { TopInnerContainer } from './commons';
import { useWeb3React } from '@web3-react/core';
import links from '@/lib/constants/links';
import { Col, Container, Row } from '@/components/Grid';

export const TabGIVbacksTop = () => {
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showGivBackExplain, setShowGivBackExplain] = useState(false);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useTokenDistro();
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { chainId } = useWeb3React();

	useEffect(() => {
		setGivBackStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(balances.givback),
		);
	}, [balances, givTokenDistroHelper]);

	return (
		<>
			<GIVbacksTopContainer>
				<TopInnerContainer>
					<Row style={{ alignItems: 'flex-end' }}>
						<Col xs={12} sm={7} xl={8}>
							<Flex alignItems='baseline' gap='16px'>
								<GBTitle>GIVbacks</GBTitle>
								<IconGIVBack size={64} />
							</Flex>
							<GBSubtitle size='medium'>
								GIVbacks rewards donors to verified projects
								with GIV, super-charging Giveth as a
								donor-driven force for good.
							</GBSubtitle>
						</Col>
						<Col xs={12} sm={5} xl={4}>
							<GIVbackRewardCard
								title='Your GIVbacks rewards'
								wrongNetworkText='GIVbacks is only available on Gnosis Chain.'
								liquidAmount={balances?.givbackLiquidPart}
								stream={givBackStream}
								actionLabel='HARVEST'
								actionCb={() => {
									setShowHarvestModal(true);
								}}
								subButtonLabel={
									balances?.givbackLiquidPart?.isZero()
										? "Why don't I have GIVbacks?"
										: undefined
								}
								subButtonCb={() => {
									setShowGivBackExplain(true);
								}}
								network={chainId}
								targetNetworks={[config.XDAI_NETWORK_NUMBER]}
							/>
						</Col>
					</Row>
				</TopInnerContainer>
			</GIVbacksTopContainer>
			{showHarvestModal && (
				<HarvestAllModal
					title='GIVbacks Rewards'
					showModal={showHarvestModal}
					setShowModal={setShowHarvestModal}
					network={config.XDAI_NETWORK_NUMBER}
				/>
			)}
			{showGivBackExplain && (
				<GIVBackExplainModal
					showModal={showGivBackExplain}
					setShowModal={setShowGivBackExplain}
				/>
			)}
		</>
	);
};

export const TabGIVbacksBottom = () => {
	const [round, setRound] = useState(0);
	const [roundStartime, setRoundStartime] = useState(new Date());
	const [roundEndTime, setRoundEndTime] = useState(new Date());
	const { givTokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		if (givTokenDistroHelper) {
			const now = getNowUnixMS();
			const deltaT = now - givTokenDistroHelper.startTime.getTime();
			const TwoWeek = 1_209_600_000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			setRound(_round);
			const _rounStartTime = new Date(givTokenDistroHelper.startTime);
			_rounStartTime.setDate(
				givTokenDistroHelper.startTime.getDate() + (_round - 1) * 14,
			);
			_rounStartTime.setHours(givTokenDistroHelper.startTime.getHours());
			_rounStartTime.setMinutes(
				givTokenDistroHelper.startTime.getMinutes(),
			);
			setRoundStartime(_rounStartTime);
			const _roundEndTime = new Date(_rounStartTime);
			_roundEndTime.setDate(_rounStartTime.getDate() + 14);
			_roundEndTime.setHours(givTokenDistroHelper.startTime.getHours());
			_roundEndTime.setMinutes(
				givTokenDistroHelper.startTime.getMinutes(),
			);
			setRoundEndTime(_roundEndTime);
		}
	}, [givTokenDistroHelper]);

	return (
		<GIVbacksBottomContainer>
			<Container>
				<Row>
					<Col xs={12} sm={6}>
						<GbDataBlock
							title='Donor Rewards'
							button={
								<GbButton
									label='DONATE TO EARN GIV'
									linkType='secondary'
									size='large'
									href='https://giveth.io/projects'
									target='_blank'
								/>
							}
						>
							When you donate to verified projects you qualify to
							receive GIV tokens. Through GIVbacks, GIV empowers
							donors with governance rights via the GIVgarden.
						</GbDataBlock>
					</Col>
					<Col xs={12} sm={6}>
						<GbDataBlock
							title='Project Verification'
							button={
								<GbButton
									label='VERIFY YOUR PROJECT'
									linkType='secondary'
									size='large'
									href='https://giveth.typeform.com/verification'
									target='_blank'
								/>
							}
						>
							Great projects make the GIVeconomy thrive! As a
							project owner, when you get your project verified,
							your donors become eligible to receive GIVbacks.
						</GbDataBlock>
					</Col>
				</Row>
				<GIVBackCard>
					<Row>
						<Col xs={12} md={8}>
							<RoundSection>
								<RoundTitle>GIVbacks Round {round}</RoundTitle>
								<RoundInfo>
									<RoundInfoRow justifyContent='space-between'>
										<P>Start Date</P>
										<P>
											{givTokenDistroHelper
												? formatDate(roundStartime)
												: '-'}
										</P>
									</RoundInfoRow>
									<RoundInfoRow justifyContent='space-between'>
										<P>End Date</P>
										<P>
											{givTokenDistroHelper
												? formatDate(roundEndTime)
												: '-'}
										</P>
									</RoundInfoRow>
									<RoundInfoTallRow
										justifyContent='space-between'
										alignItems='center'
									>
										<P>GIV Allocated to Round</P>
										<GivAllocated>
											1 Million GIV
										</GivAllocated>
									</RoundInfoTallRow>
									<RoundButton
										size='small'
										label={'DONATE TO EARN GIV'}
										buttonType='primary'
										onClick={() => {
											window.open(
												'https://giveth.io/projects',
												'_blank',
											);
										}}
									/>
								</RoundInfo>
							</RoundSection>
						</Col>
						<Col xs={12} md={4}>
							<InfoSection>
								<InfoImage src='/images/hands.svg' />
								<InfoTitle weight={700}>
									When you give you get GIV back!
								</InfoTitle>
								<InfoDesc>
									Each GIVbacks round lasts two weeks. After
									the End Date, the GIV Allocated to that
									round is distributed to Givers who donated
									to verified projects during the round.
									Projects must apply for verification at
									least 1 week prior to the Start Date in
									order to be included in the round.
								</InfoDesc>
								<InfoReadMore
									target='_blank'
									href={links.GIVBACK_DOC}
								>
									<span>Read More </span>
									<IconExternalLink
										size={16}
										color={brandColors.cyan[500]}
									/>
								</InfoReadMore>
							</InfoSection>
						</Col>
					</Row>
				</GIVBackCard>
			</Container>
		</GIVbacksBottomContainer>
	);
};
