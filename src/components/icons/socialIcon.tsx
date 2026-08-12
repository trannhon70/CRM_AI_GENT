import facebook from "../../assets/images/facebook.png";
import instagram from "../../assets/images/instagram.png";

interface SocialIconProps {
    value: "facebook" | "instagram";
    className?: string;
}

export const SocialIcon = ({ value, className = "w-4 h-4", }: SocialIconProps) => {
    const icons = { facebook, instagram };

    return (
        <img
            src={icons[value]}
            alt={value}
            className={className}
        />
    );
};