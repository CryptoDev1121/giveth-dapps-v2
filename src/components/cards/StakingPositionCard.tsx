import React, { FC, useState, useEffect } from 'react';
import { BigNumber } from 'ethers';

import { SublineBold } from '@giveth/ui-design-system';
import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useStakingNFT } from '@/hooks/useStakingNFT';
import { YellowDot } from './PositionCard';
import {
	OutOfRangeBadgeContianer,
	OutOfRangeTooltip,
} from './BaseStakingCard.sc';
import { IconWithTooltip } from '../IconWithToolTip';
import { useLiquidityPositions } from '@/hooks/useLiquidityPositions';

const OutOfRangeBadge = () => (
	<OutOfRangeBadgeContianer alignItems='center'>
		<YellowDot />
		<SublineBold>Out of Range</SublineBold>
	</OutOfRangeBadgeContianer>
);

interface IStakingPositionCardProps {
	poolStakingConfig: PoolStakingConfig;
}

const StakingPositionCard: FC<IStakingPositionCardProps> = ({
	poolStakingConfig,
}) => {
	const { apr, unstakedPositions, stakedPositions, currentIncentive } =
		useLiquidityPositions();
	const { rewardBalance } = useStakingNFT(stakedPositions);
	const [oneOfPositionsOutOfRange, setOneOfPositionsOutOfRange] =
		useState(false);
	const stakeInfo = {
		apr: apr,
		notStakedAmount: BigNumber.from(unstakedPositions.length),
		earned: rewardBalance,
		stakedAmount: BigNumber.from(stakedPositions.length),
	};

	useEffect(() => {
		const _oneOfPositionsOutOfRange = stakedPositions.some(
			stakedPosition => {
				const { pool, tickLower, tickUpper } =
					stakedPosition._position || {};
				// Check price range
				const below =
					pool && typeof tickLower === 'number'
						? pool.tickCurrent < tickLower
						: undefined;
				const above =
					pool && typeof tickUpper === 'number'
						? pool.tickCurrent >= tickUpper
						: undefined;
				return below || above;
			},
		);
		setOneOfPositionsOutOfRange(_oneOfPositionsOutOfRange);
	}, [stakedPositions]);

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
			stakedPositions={stakedPositions}
			unstakedPositions={unstakedPositions}
			currentIncentive={currentIncentive}
			notif={
				oneOfPositionsOutOfRange && (
					<IconWithTooltip
						icon={<OutOfRangeBadge />}
						direction={'top'}
					>
						<OutOfRangeTooltip>
							One or more of your position(s) are out of range and
							not earning rewards. Please unstake and make a new
							position.
						</OutOfRangeTooltip>
					</IconWithTooltip>
				)
			}
		/>
	);
};

export default StakingPositionCard;
