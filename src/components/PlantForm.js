import React from 'react';
import PlantCard from './PlantCard';
import Calendar from 'react-calendar';
import firebase from '../firebase';

const dbRef = firebase.database().ref('/items');


class PlantForm extends React.Component {
    state = {
        selectedOption: '',
        dynamicName: '',
        selectedTime: '',
        date: '',
        everyOtherDay: '',
        everyWeek: '',
        everyTwoWeeks: '',
        everyThreeWeeks: '',
        everyMonth: '',
        items: [],
    }

    componentDidMount() {
        dbRef.on('value', (snapshot) => {
            const newItemsArray = [];
            const firebaseItems = snapshot.val();

            for (let key in firebaseItems) {
                const firebaseItem = firebaseItems[key];
                firebaseItem.id = key;

                newItemsArray.push(firebaseItem);
            }
            console.log(newItemsArray);

            this.setState({
                items: newItemsArray
            });
        });
    }

    handleOptionChange = (e) => {
        this.setState({
            selectedOption: e.target.value
        });
    }

    handleChangeText = (e) => {
        this.setState({
            dynamicName: e.target.value
        });
    }

    handleTimeChange = (e) => {
        this.setState({
            selectedTime: e.target.value,
            everyOtherDay: 8640000000,
            everyWeek: 604800000000,
            everyTwoWeeks: 121000000000,
            everyThreeWeeks: 1814000000000,
            everyMonth: 7884000000000
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            plant: this.state.selectedOption,
            water: this.state.selectedTime,
            name: this.state.dynamicName,
            dateSubmitted: this.state.date
        };
        dbRef.push(newItem);
    }

    removeItem = (key) => {
        const itemRef = firebase.database().ref(`/items/${key}`);
        itemRef.remove();
    }

    updateDate = date => {
        // const date = moment(e.target.value);
        this.setState({
            date
        });

        console.log(date);
    }

    render() {
        return (
            <React.Fragment>
                <section className="add-plants">
                    <form onSubmit={this.handleSubmit}>
                        <div className="type">
                            <div className="instruction">Select Plant Type</div>
                            <div className="flex-container">
                                <label htmlFor="cacti">Cactus</label>
                                <input 
                                    type="radio" 
                                    name="plantType" 
                                    id="cacti" 
                                    value={this.state.selectedOption ? 'Cactus' : undefined} 
                                    onChange={this.handleOptionChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="succulent">Succulent</label>
                                <input 
                                    type="radio" 
                                    name="plantType" 
                                    id="succulent" 
                                    value={this.state.selectedOption ? 'Succulent' : undefined} 
                                    onChange={this.handleOptionChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="house-plant">House Plant</label>
                                <input 
                                    type="radio" 
                                    name="plantType" 
                                    id="house-plant" 
                                    value={this.state.selectedOption ? 'House' : undefined} 
                                    onChange={this.handleOptionChange} 
                                />
                            </div>
                        </div>
                        <div className="dynamic-name">
                            <div className="instruction">What's it's name?</div>
                            <label htmlFor="plant-name">
                                <input 
                                type="text" 
                                className="plant-name" 
                                name="dynamicName" 
                                placeholder='i.e. Pothos, Prayer Plant, "Ben"' 
                                value={this.state.dynamicName ? this.state.dynamicName : undefined} 
                                onChange={this.handleChangeText} 
                            />
                            </label>
                        </div>
                        <div className="water-tracker">
                            <div className="instruction">How often does you plant need to be watered?</div>
                            <div className="flex-container">
                                <label htmlFor="other-day">Every Other Day</label>
                                <input 
                                    type="radio" 
                                    name="waterTracker" 
                                    id="other-day" 
                                    value="every other day" 
                                    onChange={this.handleTimeChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="week">Every Week</label>
                                <input 
                                    type="radio" 
                                    name="waterTracker" 
                                    id="week" value="every week" 
                                    onChange={this.handleTimeChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="two-weeks">Every Two Weeks</label>
                                <input 
                                    type="radio" 
                                    name="waterTracker" 
                                    id="two-weeks" 
                                    value="every two weeks" 
                                    onChange={this.handleTimeChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="three-weeks">Every Three Weeks</label>
                                <input 
                                    type="radio" 
                                    name="waterTracker" 
                                    id="three-weeks" 
                                    value="every three weeks" 
                                    onChange={this.handleTimeChange} 
                                />
                            </div>
                            <div className="flex-container">
                                <label htmlFor="month">Every Month</label>
                                <input 
                                    type="radio" 
                                    name="waterTracker" 
                                    id="month" value="every month" 
                                    onChange={this.handleTimeChange} 
                                />
                            </div>
                        </div>
                        <div className="calendar">
                            <Calendar
                                onChange={this.updateDate}
                                date={this.state.date}
                            />
                        </div>
                        <input type="submit" />
                    </form>
                </section>
                <PlantCard
                    items={this.state.items}
                    getWaterDate={this.getWaterDate}
                    removeItem={this.removeItem}
                />
            </React.Fragment>
        )
    }
}

export default PlantForm;