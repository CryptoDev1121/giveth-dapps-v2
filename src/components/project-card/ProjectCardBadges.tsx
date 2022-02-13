import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FlexCenter } from '../styled-components/Grid';
import VerificationBadge from '../badges/VerificationBadge';
import grayHeartIcon from '/public//images/heart_gray.svg';
import redHeartIcon from '/public//images/heart_red.svg';
import shareIcon from '/public//images/share.svg';
import { IReaction } from '../../apollo/types/types';
import useUser from '@/context/UserProvider';
import { brandColors, Subline } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ShareModal from '../modals/ShareModal';

interface IBadgeWrapper {
	width?: string;
}

interface IProjectCardBadges {
	reaction?: IReaction;
	totalReactions?: number;
	verified?: boolean;
	traceable?: boolean;
	isHover?: boolean;
	likes?: number;
	cardWidth?: string;
	projectHref: string;
	projectDescription?: string;
}

const ProjectCardBadges = (props: IProjectCardBadges) => {
	const {
		state: { user },
	} = useUser();

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const {
		totalReactions,
		reaction,
		verified,
		isHover,
		traceable,
		projectHref,
		projectDescription,
	} = props;
	const likes = totalReactions || 0;

	useEffect(() => {
		if (user?.id) {
			setHeartedByUser(!!reaction?.id);
		}
	}, [user]);

	return (
		<>
			{showModal && (
				<ShareModal
					showModal={showModal}
					setShowModal={setShowModal}
					projectHref={projectHref}
					projectDescription={projectDescription}
				/>
			)}
			<BadgeWrapper>
				<BadgeContainer>
					{verified && <VerificationBadge verified />}
					{traceable && <VerificationBadge trace />}
				</BadgeContainer>
				<BadgeContainer>
					{Number(likes) > 0 && <LikeBadge>{likes}</LikeBadge>}
					<HeartWrap active={heartedByUser} isHover={isHover}>
						<Image
							src={heartedByUser ? redHeartIcon : grayHeartIcon}
							alt='heart icon'
						/>
						<ShareImageButton
							src={shareIcon}
							alt='share icon'
							onClick={() => setShowModal(true)}
						/>
					</HeartWrap>
				</BadgeContainer>
			</BadgeWrapper>
		</>
	);
};

const BadgeContainer = styled.div`
	display: flex;
`;

const ShareImageButton = styled(Image)`
	cursor: pointer;
`;

const HeartWrap = styled(FlexCenter)<{ active?: boolean; isHover?: boolean }>`
	height: ${props => (props.isHover ? '72px' : '30px')};
	width: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	border-radius: 56px;
	background: ${props => (props.active ? 'white' : brandColors.deep[800])};
	transition: all 0.3s ease;

	> span:nth-of-type(2) {
		display: ${props => (props.isHover ? 'unset' : 'none !important')};
	}
`;

const LikeBadge = styled(Subline)`
	color: white;
	margin-right: 6px;
	margin-top: 7px;
`;

const BadgeWrapper = styled.div<IBadgeWrapper>`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 16px;
`;

export default ProjectCardBadges;
