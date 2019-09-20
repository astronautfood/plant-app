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
        selectedPlant: '',
        dynamicName: '',
        selectedTime: '',
        selectedDate: '',
        items: [],
        isSubmitted: false
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

                    this.setState({
                        items: newItemsArray
                    });
                });
            } 
        });
    }


    handleTypeChange = (e) => {
        this.setState({
            selectedPlant: e.target.value
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

    updateDate = e => {
        const date = moment(e.target.value);

        this.setState({
            selectedDate: date.format('YYYY-MM-DD'),
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            plantType: this.state.selectedPlant,
            waterTime: this.state.selectedTime,
            name: this.state.dynamicName,
            dateSubmitted: this.state.selectedDate
        };
        dbRef.push(newItem);

        this.setState({ isSubmitted: true })
    }

    removeItem = (key) => {
        const itemRef = firebase.database().ref(`/items/${key}`);
        itemRef.remove();
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
                {this.state.user ? <button onClick={this.logout} className="auth">Log Out</button> : <button onClick={this.login} className="auth">Log In</button>}
                <form onSubmit={this.handleSubmit} className="plant-form">
                    <div className="plant-form__type">
                        <div className="plant-form__guide">Select Plant Type</div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="cacti" 
                                value="Cactus"
                                onChange={this.handleTypeChange} 
                            />
                            <label htmlFor="cacti">Cactus</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="succulent" 
                                value="Succulent"
                                onChange={this.handleTypeChange} 
                            />
                            <label htmlFor="succulent">Succulent</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="housePlant" 
                                value="House Plant"
                                onChange={this.handleTypeChange} 
                            />
                            <label htmlFor="housePlant">House Plant</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="tropicalPlant" 
                                value="Tropical Plant" 
                                onChange={this.handleTypeChange} 
                            />
                            <label htmlFor="tropicalPlant">Tropical Plant</label>
                        </div>
                    </div>
                    <div className="plant-form__dynamic-name">
                        <div className="plant-form__guide">What's its name?</div>
                            <input 
                                type="text" 
                                className="plant-form__name" 
                                name="dynamicName" 
                                placeholder='example: Pothos, Snake plant' 
                                value={this.state.dynamicName ? this.state.dynamicName : undefined} 
                                onChange={this.handleChangeText} 
                            />
                            <label htmlFor="plant-form__plant-name"/>
                    </div>
                    <div className="plant-form__water-tracker">
                        <div className="plant-form__guide">How often does you plant need to be watered?</div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="waterTracker" 
                                id="other-day" 
                                value="every other day" 
                                onChange={this.handleTimeChange} 
                            />
                            <label htmlFor="other-day">Every Other Day</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="waterTracker" 
                                id="week" value="every week" 
                                onChange={this.handleTimeChange} 
                            />
                            <label htmlFor="week">Every Week</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input
                                type="radio" 
                                name="waterTracker" 
                                id="two-weeks" 
                                value="every two weeks" 
                                onChange={this.handleTimeChange} 
                            />
                            <label htmlFor="two-weeks">Every Two Weeks</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="waterTracker" 
                                id="three-weeks" 
                                value="every three weeks" 
                                onChange={this.handleTimeChange} 
                            />
                            <label htmlFor="three-weeks">Every Three Weeks</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="waterTracker" 
                                id="month" value="every month" 
                                onChange={this.handleTimeChange} 
                            />
                            <label htmlFor="month">Every Month</label>
                        </div>
                    </div>
                    <div className="plant-form__guide">When was the last time you watered your plant?</div>
                        <input 
                            id="date" 
                            type="date" 
                            name="selectedDate" 
                            onChange={this.updateDate} 
                            value={this.state.selectedDate} 
                            max={moment().format("YYYY-MM-DD")}
                        />
                    <input type="submit" className="plant-form__submit"/>
                </form>
                <PlantCard
                    items={this.state.items}
                    getWaterDate={this.getWaterDate}
                    removeItem={this.removeItem}
                    user={this.state.user}
                    isSubmitted={this.state.isSubmitted}
                />
            </React.Fragment>
        )
    }
}

export default PlantForm;