import React from 'react';
import moment from 'moment';


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
        const { items, removeItem } = this.props;
        console.log(items.dateSubmitted);
        return (
            <React.Fragment>
                <section className="plant-cards">
                    <div className="wrapper">
                        <div className="plant-card">
                            <ul>
                                {items.map((item, i) => {
                                    console.log(item);
                                    let lastWatered = moment(item.dateSubmitted);
                                    const waterTime = lastWatered.add('days', this.getWaterDate(item.water));
                                    const whenToWater = moment().to(waterTime);

                                    //create dynamic user cards
                                    return (
                                        <li key={i} >
                                            <p className="today">{moment().format('LLLL')}</p>
                                            <p className="plantType__user-input"><span>Plant Type:</span> {item.plant}</p>
                                            <p className="name__user-input"><span>Name:</span> {item.name}</p>
                                            <p className="water-me">Water me {item.water}</p>
                                            <p className="display-when">Water me {whenToWater}<img src="./dev/assets/branch.png" /></p>
                                            <button onClick={() => removeItem(item.id)}>Remove Item</button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>

            </React.Fragment>
        )
    }
}

export default PlantCard;