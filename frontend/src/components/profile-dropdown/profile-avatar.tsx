import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileAvatarProps {
    display?: string;
    name?: string;
    size?: number;
}

const DEFAULT_AVATAR_SIZE = 50;

// @ts-ignore
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ display, name, size }) => {
    const avatarSize = size || DEFAULT_AVATAR_SIZE;

    return (
        <Avatar>
            <AvatarImage alt={name || display || 'Profile Avatar'} height={avatarSize} width={avatarSize} />
            <AvatarFallback>
                {name ? name[0].toUpperCase() : display || '?'}
            </AvatarFallback>
        </Avatar>
    );
};

export default ProfileAvatar;