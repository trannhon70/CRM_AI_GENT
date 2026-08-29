import facebook from "../../assets/images/facebook.png";
import instagram from "../../assets/images/instagram.png";
import telegram from "../../assets/images/telegram.png";

interface SocialIconProps {
    value: "facebook" | "instagram" | "telegram";
    className?: string;
}

export const SocialIcon = ({ value, className = "w-4 h-4", }: SocialIconProps) => {
    const icons = { facebook, instagram, telegram };

    return (
        <img
            src={icons[value]}
            alt={value}
            className={className}
        />
    );
};