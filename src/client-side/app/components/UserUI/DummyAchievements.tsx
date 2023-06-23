import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faSkull, faCrown, faBoltLightning, faClover } from '@fortawesome/free-solid-svg-icons'
import { Achievement } from '@/lib/DTO/AppData'

//This is a placeholder 
const AchievementTypes: Achievement[] = [
    {
        _id: 0,
        name: "You're a Winner!",
        description: "Won your first game",
        // icon: faTrophy,
    },
    {
        _id: 1,
        name: "Can't Stop Me Now",
        description: "Won 10 games",
        // icon: faBoltLightning,
    },
    {
        _id: 2,
        name: "Beginner's Luck",
        description: "Won your first competitive match",
        // icon: faClover,
    },
    {
        _id: 3,
        name: "Simply the Best",
        description: "Reached #1 on Competitive Ladder",
        // icon: faCrown,
    },
    {
        _id: 4,
        name: "RIP in Peace",
        description: "You lost a game :(",
        // icon: faSkull,
    },
]

const GenericAchievement = ({id}: {id: number}) => {


    const item: Achievement = AchievementTypes[id];
    return (
        <div className="Entity Achievement">
            <p>
                <span> <FontAwesomeIcon icon={item?.icon} size="sm"/> </span>
                <strong>{item?.name}</strong>
                <span>{item?.description}</span>
            </p>
        </div>
    );
}

export default GenericAchievement;