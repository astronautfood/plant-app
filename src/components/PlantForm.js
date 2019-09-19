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
                {this.state.user ? <button onClick={this.logout} className="auth">Log Out</button> : <button onClick={this.login} className="auth">Log In</button>}
                <form onSubmit={this.handleSubmit} className="plant-form">
                    <div className="plant-form__type">
                        <div className="plant-form__guide">Select Plant Type</div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="cacti" 
                                value={this.state.selectedOption ? 'Cactus' : undefined} 
                                onChange={this.handleOptionChange} 
                            />
                            <label htmlFor="cacti">Cactus</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="succulent" 
                                value={this.state.selectedOption ? 'Succulent' : undefined} 
                                onChange={this.handleOptionChange} 
                            />
                            <label htmlFor="succulent">Succulent</label>
                        </div>
                        <div className="plant-form__input-container">
                            <input 
                                type="radio" 
                                name="plantType" 
                                id="house-plant" 
                                value={this.state.selectedOption ? 'House' : undefined} 
                                onChange={this.handleOptionChange} 
                            />
                            <label htmlFor="house-plant">House Plant</label>
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
                                checked="checked"
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
                />
            </React.Fragment>
        )
    }
}

export default PlantForm;