import React from 'react';
import moment from 'moment';
import branch from '../assets/branch.png'


class PlantCard extends React.Component {

    getWaterDate = (time) => {
        if (time === "every month") {
            return 30
        }
        else if (time === "every three weeks") {
            return 21
        }
        else if (time === "every two weeks") {
            return 14
        }
        else if (time === "every week") {
            return 7
        }
        else {
            return 2
        }
    };

    render() {
        const { items, removeItem, isSubmitted, user } = this.props;
        return (
            <ul className="plant-cards">
                    {isSubmitted && !user && <p className="auth__instruction">Please login to see your plant tracking information!</p>}
                    {items.map((item, i) => {
                        const lastWatered = moment(item.dateSubmitted);
                        const waterTime = lastWatered.add('days', this.getWaterDate(item.waterTime));
                        const whenToWater = moment().to(waterTime);
                        return (
                            <li key={i} className="plant-cards__card">
                                <p className="plant-cards__card--today">{moment().format('LLLL')}</p>
                                <div className="plant-cards__card--given-details">
                                    Plant details:
                                    {items.plantType || item.waterTime ? (
                                        <ul>
                                            <li className="plant-cards__card--type">{item.plantType ? `🌿 ${item.plantType}` : ""}</li>
                                            <li className="plant-cards__card--water-me-every">{item.waterTime ? `🌿 Should be watered ${item.waterTime}` : ""}</li>
                                        </ul>
                                    ) : (
                                        <ul>
                                                <li><span role="img" aria-label="skull emoji">💀</span> not provided</li>
                                        </ul>
                                        ) 
                                    }
                                </div>
                                <p className="plant-cards__card--water-me-in">{whenToWater === "Invalid date" ? "Please enter valid dates in form" : `Water ${item.name ? item.name : "me"} ${whenToWater}`}<img src={branch} alt="flat illustration of plant sprout"/></p>
                                <button onClick={() => removeItem(item.id)} className="plant-cards__card--remove">Remove Item</button>
                            </li>
                        );
                    })}
                </ul>
        )
    }
}

export default PlantCard;