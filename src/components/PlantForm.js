import React from 'react';
import PlantCard from './PlantCard';
import firebase from '../firebase';
import moment from 'moment';

const dbRef = firebase.database().ref('/items');

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class PlantForm extends React.Component {
    state = {
        user: null,
        selectedOption: '',
        dynamicName: '',
        selectedTime: '',
        selectedDate: '',
        everyOtherDay: '',
        everyWeek: '',
        everyTwoWeeks: '',
        everyThreeWeeks: '',
        everyMonth: '',
        items: [],
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });

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
        });
    }


    handleOptionChnge = (e) => {
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
            selectedTime: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            plant: this.state.selectedOption,
            water: this.state.selectedTime,
            name: this.state.dynamicName,
            dateSubmitted: this.state.selectedDate
        };
        dbRef.push(newItem);
    }

    removeItem = (key) => {
        const itemRef = firebase.database().ref(`/items/${key}`);
        itemRef.remove();
    }

    
    updateDate = e => {
        const date = moment(e.target.value);

        this.setState({
            selectedDate: date.format('YYYY-MM-DD'),
        });
    }


    login = () => {
      auth.signInWithPopup(provider) 
        .then((result) => { 
          const user = result.user;
          this.setState({
            user
        });
      });
    }

    logout  = () => {
      window.location.reload();
      auth.signOut()
        .then(() => {
          this.setState({
            user: null
          });
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.user ? <button onClick={this.logout}>Log Out</button> : <button onClick={this.login}>Log In</button>}
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
                                    checked="checked"
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
                         <div className="instruction">When was the last time you watered your plant?</div>
                            <input 
                                id="date" 
                                type="date" 
                                name="selectedDate" 
                                onChange={this.updateDate} 
                                value={this.state.selectedDate} 
                                max={moment().format("YYYY-MM-DD")}
                            />
                        <input type="submit" />
                    </form>
                </section>
                <PlantCard
                    items={this.state.items}
                    getWaterDate={this.getWaterDate}
                    removeItem={this.removeItem}
                    user={this.state.user}
                />
            </React.Fragment>
        )
    }
}

export default PlantForm;